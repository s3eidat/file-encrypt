/* File Encrypt — chunked AES-256-GCM (Web Crypto). Key = PBKDF2-SHA256(password, 16-byte random salt, 600,000).
   Format "S3EF" v1 (full spec in README):
     header (40 B): magic "S3EF" | version 1 | kdf 1 | reserved 0x0000 | iterations u32 | chunkSize u32 | salt 16 | noncePrefix 8
     records: [u32 length][AES-GCM ciphertext+tag] ...  record 0 = JSON metadata, records 1..n = file data
     record i: IV = noncePrefix || u32(i);  AAD = header || u32(i) || u8(isLastRecord)
   The per-file key (fresh salt) plus the counter IV means an IV is never reused under a key; the index and last-record flag in
   the AAD stop chunks being reordered, dropped, duplicated or the file being truncated or extended without detection. */
(function () {
  "use strict";
  var $ = S3.$, $$ = S3.$$;
  var MAGIC = [0x53, 0x33, 0x45, 0x46], VERSION = 1, KDF = 1, HEADER_LEN = 40, TAG = 16;
  var ITER = 600000, MIN_ITER = 100000, MAX_ITER = 10000000;
  var CHUNK = 4 * 1024 * 1024, MIN_CHUNK = 1024, MAX_CHUNK = 64 * 1024 * 1024, MAX_META = 65536;
  var enc = new TextEncoder(), dec = new TextDecoder("utf-8", { fatal: true });

  function FE(msg, kind) { var e = new Error(msg); e.userFacing = true; e.kind = kind || "damaged"; return e; }
  function random(n) { var b = new Uint8Array(n); crypto.getRandomValues(b); return b; }
  function u32(n) { var b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n, false); return b; }
  function readU32(b, at) { return new DataView(b.buffer, b.byteOffset, b.byteLength).getUint32(at || 0, false); }
  function bytes(blob, a, b) { return blob.slice(a, b).arrayBuffer().then(function (x) { return new Uint8Array(x); }); }
  function deriveKey(password, salt, iterations) {
    return crypto.subtle.importKey("raw", enc.encode(String(password).normalize("NFC")), "PBKDF2", false, ["deriveKey"]).then(function (base) {
      return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: salt, iterations: iterations }, base,
        { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    });
  }
  function ivFor(prefix, i) { var iv = new Uint8Array(12); iv.set(prefix, 0); iv.set(u32(i), 8); return iv; }
  function aadFor(header, i, last) { var a = new Uint8Array(HEADER_LEN + 5); a.set(header, 0); a.set(u32(i), HEADER_LEN); a[HEADER_LEN + 4] = last ? 1 : 0; return a; }
  function safeName(n) {
    n = String(n || "").replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, "_").replace(/^[\s.]+|[\s.]+$/g, "").slice(0, 200);
    return n || "decrypted-file";
  }
  function safeType(t) { return /^[\w.+-]{1,64}\/[\w.+-]{1,128}$/.test(t || "") ? t : "application/octet-stream"; }
  function isS3ef(head) { return head.length >= 4 && MAGIC.every(function (m, i) { return head[i] === m; }); }

  async function encryptBlob(blob, name, password, opts) {
    opts = opts || {};
    var chunk = opts.chunkSize || CHUNK, iterations = opts.iterations || ITER, progress = opts.onProgress || function () {};
    var nData = Math.ceil(blob.size / chunk);
    if (nData + 1 > 0xFFFFFFFF) throw FE("This file is too large for the format.");
    var salt = random(16), prefix = random(8), header = new Uint8Array(HEADER_LEN);
    header.set(MAGIC, 0); header[4] = VERSION; header[5] = KDF; // bytes 6-7 reserved = 0
    header.set(u32(iterations), 8); header.set(u32(chunk), 12); header.set(salt, 16); header.set(prefix, 32);
    progress(0, "key");
    var key = await deriveKey(password, salt, iterations);
    var parts = [header];
    async function seal(i, plain, last) {
      var ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv: ivFor(prefix, i), additionalData: aadFor(header, i, last), tagLength: 128 }, key, plain);
      parts.push(new Blob([u32(ct.byteLength), ct]));
    }
    var meta = enc.encode(JSON.stringify({ name: String(name || "file"), size: blob.size, type: blob.type || "", modified: blob.lastModified || 0 }));
    if (meta.length > MAX_META) throw FE("The file name is too long.");
    await seal(0, meta, nData === 0);
    for (var k = 1; k <= nData; k++) {
      if (opts.cancelled && opts.cancelled()) throw FE("Cancelled.", "cancel");
      var plain = await bytes(blob, (k - 1) * chunk, Math.min(k * chunk, blob.size));
      await seal(k, plain, k === nData);
      progress(k / nData, "data");
    }
    progress(1, "data");
    return new Blob(parts, { type: "application/octet-stream" });
  }

  async function decryptBlob(blob, password, opts) {
    opts = opts || {};
    var progress = opts.onProgress || function () {};
    if (blob.size < HEADER_LEN) throw FE("This isn't an encrypted .s3enc file (it's too small).", "format");
    var header = await bytes(blob, 0, HEADER_LEN);
    if (!isS3ef(header)) throw FE("This isn't a File Encrypt (.s3enc) file.", "format");
    if (header[4] !== VERSION) throw FE("This file uses format version " + header[4] + ". Open the latest File Encrypt to decrypt it.", "format");
    if (header[5] !== KDF || header[6] || header[7]) throw FE("Unsupported or damaged file header.", "format");
    var iterations = readU32(header, 8), chunk = readU32(header, 12);
    if (iterations < MIN_ITER || iterations > MAX_ITER || chunk < MIN_CHUNK || chunk > MAX_CHUNK) throw FE("The file header is damaged.", "format");
    progress(0, "key");
    var key = await deriveKey(password, header.slice(16, 32), iterations), prefix = header.slice(32, 40);
    var off = HEADER_LEN, i = 0, meta = null, expected = 0, out = [], written = 0;
    for (;;) {
      if (opts.cancelled && opts.cancelled()) throw FE("Cancelled.", "cancel");
      if (off + 4 > blob.size) throw FE("The file is incomplete: it was cut off.", "truncated");
      var len = readU32(await bytes(blob, off, off + 4));
      if (len < TAG || len > (i === 0 ? MAX_META : chunk) + TAG) throw FE("The file is damaged (bad chunk " + i + ").");
      var end = off + 4 + len;
      if (end > blob.size) throw FE("The file is incomplete: it was cut off.", "truncated");
      var last = end === blob.size, plain;
      try {
        plain = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivFor(prefix, i), additionalData: aadFor(header, i, last), tagLength: 128 },
          key, await bytes(blob, off + 4, end)));
      } catch (e) {
        if (i === 0) throw FE("Wrong password, or the file is damaged.", "password");
        if (last) throw FE("The file is incomplete or was changed (chunk " + i + " failed its integrity check).", "truncated");
        throw FE("The file was changed or reordered (chunk " + i + " failed its integrity check).");
      }
      if (i === 0) {
        try { meta = JSON.parse(dec.decode(plain)); } catch (e) { throw FE("The file's metadata is damaged."); }
        if (!meta || typeof meta.size !== "number" || meta.size < 0 || meta.size !== Math.floor(meta.size)) throw FE("The file's metadata is damaged.");
        expected = Math.ceil(meta.size / chunk);
        if (last && expected) throw FE("The file is incomplete: it was cut off.", "truncated");
      } else {
        var want = i < expected ? chunk : meta.size - (expected - 1) * chunk;
        if (i > expected || plain.length !== want) throw FE("The file is damaged (chunk " + i + " has the wrong size).");
        if (last !== (i === expected)) throw FE("The file is incomplete: it was cut off.", "truncated");
        out.push(plain); written += plain.length;
      }
      progress(end / blob.size, "data");
      off = end; i++;
      if (last) break;
    }
    if (written !== meta.size) throw FE("The file is incomplete: it was cut off.", "truncated");
    return { blob: new Blob(out, { type: safeType(meta.type) }), name: safeName(meta.name), size: meta.size, modified: meta.modified };
  }

  // ---------- UI ----------
  var mode = "enc", file = null, busy = false, cancelFlag = false, output = null;
  var pw = $("#pw"), pw2 = $("#pw2");

  function setMode(m) {
    mode = m;
    $$("#mode button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.v === m)); });
    var e = m === "enc";
    $("#pw2-wrap").hidden = !e;
    pw.autocomplete = e ? "new-password" : "current-password";
    $("#step1").textContent = e ? "1. Choose a file" : "1. Choose an .s3enc file";
    $("#drop-title").textContent = e ? "Drop a file here or click to choose" : "Drop an .s3enc file here or click to choose";
    $("#drop-sub").textContent = e ? "Any type, any size your browser can hold" : "Made by File Encrypt";
    $("#go span").textContent = e ? "Encrypt file" : "Decrypt file";
    resetResult("Pick a file and a password to start.");
  }
  function resetResult(msg) {
    output = null; $("#result").hidden = true; setBar(0, "");
    status(msg || "", "");
  }
  function status(msg, cls) { var s = $("#status"); s.textContent = msg; s.className = "fe-status " + (cls || "muted"); }
  function setBar(f, cls) { var b = $("#bar"); b.style.width = Math.round(f * 100) + "%"; b.className = cls || ""; }

  function pick(files) {
    file = files[0]; output = null;
    $("#file").hidden = false; $("#drop").hidden = true;
    $("#fname").textContent = file.name; $("#fsize").textContent = S3.fmtBytes(file.size);
    resetResult("Ready.");
    bytes(file, 0, 4).then(function (h) {
      if (isS3ef(h) && mode === "enc") { setMode("dec"); status("This is an encrypted file, so I switched to Decrypt.", "muted"); }
    });
    pw.focus();
  }
  S3.drop($("#drop"), pick, { multiple: false });
  $("#unpick").addEventListener("click", function () { file = null; $("#file").hidden = true; $("#drop").hidden = false; resetResult("Pick a file and a password to start."); });
  $$("#mode button").forEach(function (b) { b.addEventListener("click", function () { if (!busy) setMode(b.dataset.v); }); });
  $("#eye").addEventListener("click", function () {
    var show = pw.type === "password";
    pw.type = pw2.type = show ? "text" : "password";
    this.setAttribute("aria-pressed", String(show)); this.textContent = show ? "Hide" : "Show";
  });

  async function run() {
    if (busy) return;
    if (!file) { S3.toast("Choose a file first", "error"); return; }
    if (!pw.value) { S3.toast("Enter a password", "error"); pw.focus(); return; }
    if (mode === "enc" && pw.value !== pw2.value) { S3.toast("The two passwords don't match", "error"); pw2.focus(); return; }
    busy = true; cancelFlag = false; output = null; $("#result").hidden = true;
    $("#go").disabled = true; $("#cancel").hidden = false;
    var t0 = performance.now(), size = file.size;
    var opts = {
      cancelled: function () { return cancelFlag; },
      onProgress: function (f, phase) {
        setBar(phase === "key" ? 0.02 : 0.02 + f * 0.98, "");
        status(phase === "key" ? "Deriving the key from your password (600,000 rounds)…" : (mode === "enc" ? "Encrypting… " : "Decrypting and verifying… ") + Math.round(f * 100) + "%", "muted");
      }
    };
    try {
      if (mode === "enc") {
        var blob = await encryptBlob(file, file.name, pw.value, opts);
        output = { blob: blob, name: file.name + ".s3enc" };
        $("#rinfo").textContent = S3.fmtBytes(blob.size) + " · encrypted";
      } else {
        var r = await decryptBlob(file, pw.value, opts);
        output = { blob: r.blob, name: r.name };
        $("#rinfo").textContent = S3.fmtBytes(r.size) + " · verified, original name restored";
      }
      var secs = (performance.now() - t0) / 1000;
      setBar(1, "ok");
      status("Done in " + (secs < 10 ? secs.toFixed(1) : Math.round(secs)) + " s" + (secs > 0.5 && size > 1e6 ? " (" + S3.fmtBytes(size / secs) + "/s)" : "") + ". Your download has started.", "ok");
      $("#rname").textContent = output.name; $("#result").hidden = false;
      S3.download(output.blob, output.name);
      S3.done();
    } catch (e) {
      setBar(1, e.kind === "cancel" ? "" : "bad");
      status(e.userFacing ? e.message : "Something went wrong: " + (e && e.message || e), e.kind === "cancel" ? "muted" : "bad");
    } finally {
      busy = false; $("#go").disabled = false; $("#cancel").hidden = true;
    }
  }
  $("#go").addEventListener("click", run);
  [pw, pw2].forEach(function (el) { el.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); run(); } }); });
  $("#cancel").addEventListener("click", function () { cancelFlag = true; });
  $("#dl").addEventListener("click", function () { if (output) S3.download(output.blob, output.name); });
  window.addEventListener("pagehide", function () { pw.value = pw2.value = ""; });
  setMode("enc");

  window.S3_DEMO = async function () {
    var f = new File([enc.encode("Quarterly numbers — keep private.\n".repeat(3000))], "report-2026.txt", { type: "text/plain" });
    pick([f]);
    pw.value = pw2.value = "correct horse battery staple";
    var realDownload = S3.download; S3.download = function () {}; // the screenshot run shouldn't save files
    try { await run(); } finally { S3.download = realDownload; }
  };

  // A tiny file encrypted with this exact format ("s3eidat" / hello.txt): proves old files keep decrypting.
  var KNOWN = "UzNFRgEBAAAACSfAAEAAAB945B/Eu5hVUNiZeda5lanSjbx8FPCZSgAAAE+JIqS2mmeWXA/TLlgK4ytovkPZva+lj/xz7rXi1VkzRdFxVusaOs0+ZbsoqPzw7iXZmT9RqJ4JcxDCF0PQYI4t+R2YzlCUa6kbWhqacxYXAAAALfg9iM68jrqwY1DjcUToxENrsQN/J4BtsOgzMmxS3fE5VPVi08xgX0lsbU7MLg==";

  window.S3_SELFTEST = async function () {
    var fails = [];
    function check(c, why) { if (!c) fails.push(why); }
    async function failsWith(p, kind) { try { await p; return false; } catch (e) { return !!e.userFacing && (!kind || e.kind === kind); } }
    function same(a, b) { if (a.length !== b.length) return false; for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
    async function all(blob) { return new Uint8Array(await blob.arrayBuffer()); }
    var CH = 4096, pwd = "pässwörd 🔑";
    var data = random(10000), src = new Blob([data], { type: "application/x-test" });
    var e1 = await encryptBlob(src, "dåta/../x.bin", pwd, { chunkSize: CH });
    var raw = await all(e1);
    check(isS3ef(raw) && raw[4] === 1 && readU32(raw, 8) === 600000 && readU32(raw, 12) === CH, "header fields");
    // header + meta record + 3 data records (4096, 4096, 1808) each with a 4-byte length and 16-byte tag
    var r0len = readU32(raw, HEADER_LEN), dataStart = HEADER_LEN + 4 + r0len;
    check(raw.length === dataStart + 3 * 20 + 10000, "layout/length");
    var d1 = await decryptBlob(e1, pwd);
    check(same(await all(d1.blob), data) && d1.blob.type === "application/x-test", "round trip");
    check(d1.name === "dåta_.._x.bin", "name restored safely: " + d1.name);
    check(same(await all((await decryptBlob(e1, pwd.normalize("NFD"))).blob), data), "same password typed in NFD form must work");
    var e2 = await encryptBlob(src, "x", pwd, { chunkSize: CH }), raw2 = await all(e2);
    check(!same(raw.slice(16, 40), raw2.slice(16, 40)), "fresh salt + nonce prefix per file");
    // exact multiple of the chunk size, and an empty file
    var even = random(2 * CH), de = await decryptBlob(await encryptBlob(new Blob([even]), "even", pwd, { chunkSize: CH }), pwd);
    check(same(await all(de.blob), even), "exact-multiple round trip");
    var dz = await decryptBlob(await encryptBlob(new Blob([]), "empty.txt", pwd, { chunkSize: CH }), pwd);
    check(dz.size === 0 && (await all(dz.blob)).length === 0 && dz.name === "empty.txt", "empty file round trip");
    // failures
    check(await failsWith(decryptBlob(e1, pwd + "!"), "password"), "wrong password must fail");
    var flipped = raw.slice(); flipped[dataStart + 4 + 100] ^= 1;
    check(await failsWith(decryptBlob(new Blob([flipped]), pwd)), "flipped data byte must fail");
    var hdr = raw.slice(); hdr[33] ^= 1; // nonce prefix
    check(await failsWith(decryptBlob(new Blob([hdr]), pwd)), "flipped header byte must fail");
    var rec = 4 + CH + TAG, r1 = dataStart, r2 = dataStart + rec;
    check(await failsWith(decryptBlob(new Blob([raw.slice(0, r2 + rec)]), pwd), "truncated"), "dropping the last chunk must fail");
    check(await failsWith(decryptBlob(new Blob([raw.slice(0, raw.length - 7)]), pwd), "truncated"), "cut mid-chunk must fail");
    check(await failsWith(decryptBlob(new Blob([raw.slice(0, dataStart)]), pwd)), "metadata only must fail");
    var swapped = new Blob([raw.slice(0, r1), raw.slice(r2, r2 + rec), raw.slice(r1, r2), raw.slice(r2 + rec)]);
    check(await failsWith(decryptBlob(swapped, pwd)), "reordered chunks must fail");
    check(await failsWith(decryptBlob(new Blob([raw, random(20)]), pwd)), "appended bytes must fail");
    var badIter = raw.slice(); badIter.set(u32(0xFFFFFFFF), 8);
    check(await failsWith(decryptBlob(new Blob([badIter]), pwd), "format"), "absurd iterations refused");
    check(await failsWith(decryptBlob(new Blob([enc.encode("hello world, not encrypted at all")]), pwd), "format"), "non-s3enc refused");
    var known = Uint8Array.from(atob(KNOWN), function (c) { return c.charCodeAt(0); });
    var dk = null; try { dk = await decryptBlob(new Blob([known]), "s3eidat"); } catch (e) { /* reported below */ }
    check(dk && dk.name === "hello.txt" && dec.decode(await all(dk.blob)) === "Hello from S3eidat Tools ✓\n", "known vector");
    if (fails.length) console.error("selftest: " + fails.join("; "));
    return fails.length === 0;
  };
})();
