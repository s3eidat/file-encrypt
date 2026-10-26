/* S3eidat Tools kit — header, footer, support, helpers. Loaded in <head>, no network, no trackers. */
(function () {
  "use strict";

  // Donation links are PUBLIC checkout URLs (no keys). Filled by scripts/sync_kit.py from _kit/config.json.
  var CONFIG = /*@@CONFIG@@*/{"brand": "S3eidat Tools", "owner": "s3eidat", "support": {"stripe": [{"emoji": "☕", "price": "$3", "label": "One coffee", "url": "https://donate.stripe.com/5kQ28q1FRdYD8UH7SicIE04"}, {"emoji": "☕☕☕", "price": "$9", "label": "Three coffees", "popular": true, "url": "https://donate.stripe.com/4gMeVcgAL7Af4Era0qcIE05"}, {"emoji": "🍰", "price": "$15", "label": "Coffee and cake", "url": "https://donate.stripe.com/00w5kC84f9In6Mz0pQcIE06"}, {"emoji": "💛", "price": "Any amount", "label": "You choose", "url": "https://donate.stripe.com/14AeVc3NZg6L6Mzb4ucIE07"}], "buymeacoffee": "", "kofi": "", "githubSponsors": ""}, "houseAds": [{"title": "s3eidatGPT", "text": "an AI assistant for chat, files and images. Try it free.", "url": "https://ai.s3eidat.com/"}, {"title": "Spark", "text": "build an app by describing it. No code needed.", "url": "https://spark.s3eidat.com/"}]}/*@@END@@*/;
  var TOOLS = /*@@TOOLS@@*/[{"slug":"json-studio","name":"JSON Studio","tagline":"Format, validate, minify and explore JSON","category":"Developer"},{"slug":"base64-kit","name":"Base64 Kit","tagline":"Encode and decode Base64 text and files","category":"Developer"},{"slug":"hash-lab","name":"Hash Lab","tagline":"MD5, SHA-1, SHA-256, SHA-512 for text and files","category":"Developer"},{"slug":"jwt-inspector","name":"JWT Inspector","tagline":"Decode JSON Web Tokens locally, check expiry","category":"Developer"},{"slug":"uuid-forge","name":"UUID Forge","tagline":"Generate UUID v4, v7, ULID and NanoID in bulk","category":"Developer"},{"slug":"regex-playground","name":"Regex Playground","tagline":"Test regular expressions with live highlighting","category":"Developer"},{"slug":"diff-view","name":"Diff View","tagline":"Compare two texts side by side","category":"Developer"},{"slug":"cron-explain","name":"Cron Explain","tagline":"Turn cron expressions into plain English","category":"Developer"},{"slug":"timestamp-convert","name":"Timestamp Convert","tagline":"Unix time to dates and back, any timezone","category":"Developer"},{"slug":"url-toolkit","name":"URL Toolkit","tagline":"Encode, decode and break down URLs","category":"Developer"},{"slug":"csv-json","name":"CSV ⇄ JSON","tagline":"Convert CSV to JSON and back with preview","category":"Developer"},{"slug":"json-to-types","name":"JSON to Types","tagline":"Generate TypeScript, Go, Python types from JSON","category":"Developer"},{"slug":"chmod-calc","name":"Chmod Calc","tagline":"Unix permission calculator","category":"Developer"},{"slug":"http-status","name":"HTTP Status","tagline":"Every HTTP status code, explained simply","category":"Developer"},{"slug":"color-convert","name":"Color Convert","tagline":"HEX, RGB, HSL, OKLCH and CMYK conversion","category":"Design"},{"slug":"css-gradient","name":"CSS Gradient","tagline":"Build beautiful CSS gradients visually","category":"Design"},{"slug":"box-shadow","name":"Box Shadow","tagline":"Layered box-shadow generator with live preview","category":"Design"},{"slug":"markdown-table","name":"Markdown Table","tagline":"Create and edit Markdown tables visually","category":"Developer"},{"slug":"lorem-gen","name":"Lorem Gen","tagline":"Placeholder text in English and Arabic","category":"Text"},{"slug":"meta-tags","name":"Meta Tags","tagline":"SEO and social preview tag generator","category":"Developer"},{"slug":"word-count","name":"Word Count","tagline":"Words, characters, reading time and more","category":"Text"},{"slug":"case-convert","name":"Case Convert","tagline":"UPPER, lower, Title, camelCase, snake_case…","category":"Text"},{"slug":"arabic-tools","name":"Arabic Tools","tagline":"Remove tashkeel, fix digits, Arabizi to Arabic","category":"Text"},{"slug":"text-cleaner","name":"Text Cleaner","tagline":"Remove duplicates, extra spaces, sort lines","category":"Text"},{"slug":"slugify","name":"Slugify","tagline":"Clean URL slugs from any title, incl. Arabic","category":"Text"},{"slug":"markdown-studio","name":"Markdown Studio","tagline":"Live Markdown editor with preview and export","category":"Text"},{"slug":"local-notes","name":"Local Notes","tagline":"Private notes that live only in your browser","category":"Productivity"},{"slug":"read-aloud","name":"Read Aloud","tagline":"Text to speech with any voice on your device","category":"Text"},{"slug":"fancy-text","name":"Fancy Text","tagline":"𝐁𝐨𝐥𝐝, 𝘪𝘵𝘢𝘭𝘪𝘤, 𝓈𝒸𝓇𝒾𝓅𝓉 and more for bios","category":"Text"},{"slug":"morse-code","name":"Morse Code","tagline":"Translate Morse code and hear it","category":"Text"},{"slug":"typing-test","name":"Typing Test","tagline":"Measure your typing speed and accuracy","category":"Productivity"},{"slug":"readability","name":"Readability","tagline":"Check how easy your writing is to read","category":"Text"},{"slug":"image-squeeze","name":"Image Squeeze","tagline":"Compress JPG, PNG and WebP images in bulk","category":"Images"},{"slug":"image-convert","name":"Image Convert","tagline":"Convert images between PNG, JPG, WebP","category":"Images"},{"slug":"image-resize","name":"Image Resize","tagline":"Resize and crop images to exact sizes","category":"Images"},{"slug":"favicon-forge","name":"Favicon Forge","tagline":"Make a full favicon set from one image","category":"Design"},{"slug":"palette-from-image","name":"Palette From Image","tagline":"Extract a color palette from any photo","category":"Design"},{"slug":"meme-maker","name":"Meme Maker","tagline":"Classic top/bottom text memes in seconds","category":"Images"},{"slug":"watermark","name":"Watermark","tagline":"Add text or logo watermarks to photos","category":"Images"},{"slug":"exif-cleaner","name":"EXIF Cleaner","tagline":"See and remove hidden photo metadata (GPS!)","category":"Security & Privacy"},{"slug":"svg-to-png","name":"SVG to PNG","tagline":"Render SVG files to PNG at any size","category":"Images"},{"slug":"placeholder-image","name":"Placeholder Image","tagline":"Generate placeholder images of any size","category":"Images"},{"slug":"photo-filters","name":"Photo Filters","tagline":"Quick photo edits: light, color, filters","category":"Images"},{"slug":"collage-maker","name":"Collage Maker","tagline":"Combine photos into a neat grid collage","category":"Images"},{"slug":"screenshot-frame","name":"Screenshot Frame","tagline":"Make screenshots look great for sharing","category":"Images"},{"slug":"image-to-base64","name":"Image to Base64","tagline":"Turn images into data URIs and back","category":"Images"},{"slug":"palette-gen","name":"Palette Gen","tagline":"Generate harmonious color palettes","category":"Design"},{"slug":"contrast-check","name":"Contrast Check","tagline":"WCAG color contrast checker","category":"Design"},{"slug":"shade-gen","name":"Shade Gen","tagline":"Tailwind-style 50–950 color scales","category":"Design"},{"slug":"icon-maker","name":"Icon Maker","tagline":"App icons from an emoji or letter","category":"Design"},{"slug":"glass-gen","name":"Glass Gen","tagline":"Glassmorphism CSS generator","category":"Design"},{"slug":"blob-maker","name":"Blob Maker","tagline":"Random organic SVG blob shapes","category":"Design"},{"slug":"qr-studio","name":"QR Studio","tagline":"Custom QR codes for links, Wi-Fi, contacts","category":"QR & Codes"},{"slug":"qr-scanner","name":"QR Scanner","tagline":"Scan QR codes with your camera or an image","category":"QR & Codes"},{"slug":"barcode-gen","name":"Barcode Gen","tagline":"Code 128, EAN-13, UPC-A barcodes as SVG","category":"QR & Codes"},{"slug":"wifi-card","name":"Wi-Fi Card","tagline":"Printable Wi-Fi QR card for guests","category":"QR & Codes"},{"slug":"pdf-merge","name":"PDF Merge","tagline":"Combine PDF files into one","category":"PDF & Docs"},{"slug":"pdf-split","name":"PDF Split","tagline":"Split a PDF or extract pages","category":"PDF & Docs"},{"slug":"pdf-organizer","name":"PDF Organizer","tagline":"Reorder, rotate and delete PDF pages","category":"PDF & Docs"},{"slug":"images-to-pdf","name":"Images to PDF","tagline":"Turn photos and scans into one PDF","category":"PDF & Docs"},{"slug":"pdf-to-images","name":"PDF to Images","tagline":"Export PDF pages as PNG or JPG","category":"PDF & Docs"},{"slug":"invoice-maker","name":"Invoice Maker","tagline":"Clean invoices you can print or save as PDF","category":"PDF & Docs"},{"slug":"resume-builder","name":"Resume Builder","tagline":"A clean one-page CV you can print to PDF","category":"PDF & Docs"},{"slug":"signature-maker","name":"Signature Maker","tagline":"Draw or type a signature, get a clean PNG","category":"PDF & Docs"},{"slug":"loan-calc","name":"Loan Calc","tagline":"Monthly payment and full amortization table","category":"Calculators"},{"slug":"compound-interest","name":"Compound Interest","tagline":"See your savings grow over time","category":"Calculators"},{"slug":"split-bill","name":"Split Bill","tagline":"Split the bill and tip between friends","category":"Calculators"},{"slug":"percentage-calc","name":"Percentage Calc","tagline":"Every percentage question, answered","category":"Calculators"},{"slug":"bmi-calc","name":"BMI Calc","tagline":"BMI, healthy weight range and body stats","category":"Calculators"},{"slug":"age-calc","name":"Age Calc","tagline":"Exact age, next birthday and fun stats","category":"Calculators"},{"slug":"date-diff","name":"Date Diff","tagline":"Days between dates, add or subtract days","category":"Calculators"},{"slug":"unit-convert","name":"Unit Convert","tagline":"Length, weight, temperature, data and more","category":"Calculators"},{"slug":"discount-calc","name":"Discount Calc","tagline":"Sale price, savings and tax in one place","category":"Calculators"},{"slug":"salary-calc","name":"Salary Calc","tagline":"Hourly, daily, monthly, yearly pay converter","category":"Calculators"},{"slug":"gpa-calc","name":"GPA Calc","tagline":"Semester and cumulative GPA for students","category":"Calculators"},{"slug":"zakat-calc","name":"Zakat Calc","tagline":"Calculate zakat on savings, gold and assets","category":"Calculators"},{"slug":"focus-timer","name":"Focus Timer","tagline":"Pomodoro timer with tasks and gentle sounds","category":"Productivity"},{"slug":"world-clock","name":"World Clock","tagline":"Time zones and a meeting planner","category":"Productivity"},{"slug":"stopwatch","name":"Stopwatch","tagline":"Stopwatch, laps and countdown timer","category":"Productivity"},{"slug":"habit-tracker","name":"Habit Tracker","tagline":"Build streaks, privately in your browser","category":"Productivity"},{"slug":"kanban-board","name":"Kanban Board","tagline":"A simple private Kanban board","category":"Productivity"},{"slug":"todo-list","name":"Todo List","tagline":"Fast, keyboard-friendly to-do list","category":"Productivity"},{"slug":"flashcards","name":"Flashcards","tagline":"Study smarter with spaced repetition","category":"Productivity"},{"slug":"wheel-picker","name":"Wheel Picker","tagline":"Spin the wheel to pick a random name","category":"Everyday"},{"slug":"dice-roller","name":"Dice Roller","tagline":"Roll dice, flip coins, draw random numbers","category":"Everyday"},{"slug":"team-maker","name":"Team Maker","tagline":"Split a list of people into random teams","category":"Everyday"},{"slug":"prayer-times","name":"Prayer Times","tagline":"Accurate prayer times for your location","category":"Everyday"},{"slug":"qibla-finder","name":"Qibla Finder","tagline":"Find the Qibla direction from where you are","category":"Everyday"},{"slug":"screen-recorder","name":"Screen Recorder","tagline":"Record your screen with audio, no install","category":"Audio & Video"},{"slug":"voice-recorder","name":"Voice Recorder","tagline":"Record voice memos with a live waveform","category":"Audio & Video"},{"slug":"audio-trimmer","name":"Audio Trimmer","tagline":"Cut and trim audio files in the browser","category":"Audio & Video"},{"slug":"metronome","name":"Metronome","tagline":"Accurate metronome with tap tempo","category":"Audio & Video"},{"slug":"guitar-tuner","name":"Guitar Tuner","tagline":"Tune your guitar with your microphone","category":"Audio & Video"},{"slug":"noise-machine","name":"Noise Machine","tagline":"White, pink and brown noise for focus and sleep","category":"Audio & Video"},{"slug":"device-check","name":"Device Check","tagline":"Test your webcam, mic and speakers","category":"Audio & Video"},{"slug":"video-frames","name":"Video Frames","tagline":"Grab frames and thumbnails from a video","category":"Audio & Video"},{"slug":"pass-forge","name":"Pass Forge","tagline":"Strong passwords and passphrases, made locally","category":"Security & Privacy"},{"slug":"password-check","name":"Password Check","tagline":"How strong is your password, really?","category":"Security & Privacy"},{"slug":"text-encrypt","name":"Text Encrypt","tagline":"Encrypt a message with a password (AES-256)","category":"Security & Privacy"},{"slug":"file-encrypt","name":"File Encrypt","tagline":"Encrypt files with a password, offline","category":"Security & Privacy"},{"slug":"stego-image","name":"Stego Image","tagline":"Hide a secret message inside an image","category":"Security & Privacy"},{"slug":"emoji-search","name":"Emoji Search","tagline":"Find and copy any emoji fast","category":"Everyday"},{"slug":"char-map","name":"Char Map","tagline":"Symbols, arrows, math and special characters","category":"Text"},{"slug":"countdown-maker","name":"Countdown Maker","tagline":"Beautiful countdowns you can share as a link","category":"Everyday"},{"slug":"scoreboard","name":"Scoreboard","tagline":"Keep score for any game, big and simple","category":"Everyday"},{"slug":"receipt-maker","name":"Receipt Maker","tagline":"Quick simple receipts for small sellers","category":"PDF & Docs"},{"slug":"cv-letter","name":"Cover Letter","tagline":"Fill-in-the-blanks cover letter builder","category":"PDF & Docs"},{"slug":"number-words","name":"Number to Words","tagline":"Write numbers as words in English and Arabic","category":"Text"},{"slug":"roman-numerals","name":"Roman Numerals","tagline":"Convert Roman numerals both ways","category":"Calculators"},{"slug":"base-convert","name":"Base Convert","tagline":"Binary, octal, decimal, hex and any base","category":"Developer"},{"slug":"keyboard-tester","name":"Keyboard Tester","tagline":"Test every key on your keyboard","category":"Everyday"}]/*@@END@@*/;

  var doc = document, root = doc.documentElement;
  var KIT_BASE = doc.currentScript ? doc.currentScript.src.replace(/[^/]*$/, "") : "kit/";

  // ---------- storage (never throws: private mode / blocked storage) ----------
  function store(key, val) {
    var k = "s3:" + key;
    try {
      if (arguments.length > 1) { if (val === undefined) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(val)); return val; }
      var raw = localStorage.getItem(k);
      return raw == null ? undefined : JSON.parse(raw);
    } catch (e) { return undefined; }
  }

  // ---------- theme: applied before first paint ----------
  function systemTheme() { return window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"; }
  function setTheme(t) { root.setAttribute("data-theme", t); }
  setTheme(store("theme") || systemTheme());

  // ---------- helpers ----------
  function $(sel, el) { return (el || doc).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function h(tag, attrs, kids) {
    var el = doc.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") el.textContent = attrs[k];
      else if (k === "html") el.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) el.appendChild(typeof c === "string" ? doc.createTextNode(c) : c); });
    return el;
  }
  function fmtBytes(n) {
    if (!isFinite(n)) return "—";
    var u = ["B", "KB", "MB", "GB"], i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (i ? n.toFixed(n < 10 ? 2 : 1) : n) + " " + u[i];
  }
  function toast(msg, kind) {
    var box = $(".s3-toasts") || doc.body.appendChild(h("div", { "class": "s3-toasts", role: "status", "aria-live": "polite" }));
    var t = h("div", { "class": "s3-toast " + (kind || "") }, [msg]);
    box.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 240); }, kind === "error" ? 4200 : 2400);
    return t;
  }
  function copy(text, label) {
    function ok() { toast((label || "Copied") + " ✓"); }
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(ok, fallback);
    return Promise.resolve(fallback());
    function fallback() {
      var ta = h("textarea", { style: "position:fixed;opacity:0" }); ta.value = text; doc.body.appendChild(ta); ta.select();
      try { doc.execCommand("copy"); ok(); } catch (e) { toast("Copy failed", "error"); }
      ta.remove();
    }
  }
  function download(data, filename, type) {
    var blob = data instanceof Blob ? data : new Blob([data], { type: type || "application/octet-stream" });
    var url = URL.createObjectURL(blob);
    var a = h("a", { href: url, download: filename });
    doc.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  // Wire a drop zone. opts: {accept: "image/*", multiple: true}. onFiles(File[])
  function drop(el, onFiles, opts) {
    opts = opts || {};
    var input = el.querySelector("input[type=file]");
    if (!input) { input = h("input", { type: "file", hidden: true }); el.appendChild(input); }
    if (opts.accept) input.accept = opts.accept;
    input.multiple = opts.multiple !== false;
    function accept(list) {
      var files = Array.prototype.slice.call(list || []);
      if (opts.accept) {
        var pats = opts.accept.split(",").map(function (s) { return s.trim().toLowerCase(); });
        files = files.filter(function (f) {
          var n = f.name.toLowerCase(), t = (f.type || "").toLowerCase();
          return pats.some(function (p) { return p.charAt(0) === "." ? n.slice(-p.length) === p : p.slice(-2) === "/*" ? t.indexOf(p.slice(0, -1)) === 0 : t === p; });
        });
      }
      if (!input.multiple) files = files.slice(0, 1);
      if (files.length) onFiles(files); else toast("That file type isn't supported here", "error");
    }
    if (el.tagName !== "LABEL") el.addEventListener("click", function (e) { if (e.target !== input) input.click(); });
    el.tabIndex = el.tabIndex < 0 ? 0 : el.tabIndex;
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
    input.addEventListener("change", function () { if (input.files.length) accept(input.files); input.value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) { el.addEventListener(ev, function (e) { e.preventDefault(); el.classList.add("is-over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { el.addEventListener(ev, function (e) { e.preventDefault(); el.classList.remove("is-over"); }); });
    el.addEventListener("drop", function (e) { accept(e.dataTransfer && e.dataTransfer.files); });
    return input;
  }
  function readFile(file, as) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
      if (as === "text") r.readAsText(file); else if (as === "dataurl") r.readAsDataURL(file); else r.readAsArrayBuffer(file);
    });
  }
  function debounce(fn, ms) { var t; return function () { var a = arguments, self = this; clearTimeout(t); t = setTimeout(function () { fn.apply(self, a); }, ms || 200); }; }

  // ---------- tiny ZIP writer (store, no compression) — files: [{name, data: Uint8Array|string}] ----------
  var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function zip(files) {
    var enc = new TextEncoder(), parts = [], central = [], off = 0;
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = typeof f.data === "string" ? enc.encode(f.data) : f.data, crc = crc32(data);
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
      lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, name.length, true);
      parts.push(lh.buffer, name, data);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
      ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, name.length, true);
      ch.setUint32(42, off, true);
      central.push(ch.buffer, name);
      off += 30 + name.length + data.length;
    });
    var csize = central.reduce(function (s, p) { return s + p.byteLength; }, 0);
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, csize, true); end.setUint32(16, off, true);
    return new Blob(parts.concat(central, [end.buffer]), { type: "application/zip" });
  }

  // ---------- icons (sprite injected once; use <svg class="i"><use href="#i-copy"/></svg>) ----------
  var ICONS = {
    coffee: '<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    play: '<path d="m6 3 14 9-14 9Z"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'
  };
  function sprite() {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">';
    for (var k in ICONS) s += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + "</symbol>";
    return s + "</svg>";
  }
  function icon(name) { return '<svg class="i" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }

  // ---------- support ----------
  var S = CONFIG.support || {};
  function stripeTiers() { return (S.stripe || []).filter(function (t) { return t && t.url; }); }
  function openSupport() {
    var tiers = stripeTiers(), alts = [];
    if (S.buymeacoffee) alts.push(['<span>☕</span> Buy Me a Coffee', S.buymeacoffee]);
    if (S.kofi) alts.push(['<span>🍵</span> Ko-fi', S.kofi]);
    if (S.githubSponsors) alts.push([icon("heart") + " GitHub Sponsors", S.githubSponsors]);
    var m = h("div", { "class": "s3-modal", role: "dialog", "aria-modal": "true", "aria-label": "Support" });
    var sheet = h("div", { "class": "s3-sheet" });
    var tierHtml = tiers.map(function (t) {
      return '<a class="s3-tier" href="' + esc(t.url) + '" target="_blank" rel="noopener"><span class="s3-cups">' + esc(t.emoji || "☕") + "</span><b>" + esc(t.price || "") + "</b><span>" + esc(t.label || "") + "</span></a>";
    }).join("");
    sheet.innerHTML =
      '<div class="row between"><h2>Buy me a coffee ☕</h2><button class="btn ghost icon" data-x aria-label="Close">' + icon("x") + "</button></div>" +
      "<p>Every tool here is free, has no sign-up and never uploads your files. If one saved you time, a coffee keeps them free and keeps new ones coming.</p>" +
      (tierHtml ? '<div class="s3-tiers">' + tierHtml + "</div>" : "") +
      '<div class="s3-alt">' + alts.map(function (a) { return '<a class="btn" href="' + esc(a[1]) + '" target="_blank" rel="noopener">' + a[0] + "</a>"; }).join("") +
      '<a class="btn ' + (tierHtml || alts.length ? "ghost" : "coffee big") + '" href="/coffee/">' + (tierHtml || alts.length ? "More ways to support" : icon("coffee") + " Open the support page") + "</a></div>" +
      '<p class="faint" style="margin:14px 0 0">Payments are handled by Stripe on its own secure page. This site never sees your card.</p>';
    m.appendChild(sheet);
    function close() { m.remove(); doc.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    m.addEventListener("click", function (e) { if (e.target === m || e.target.closest("[data-x]")) close(); });
    doc.addEventListener("keydown", onKey);
    doc.body.appendChild(m);
    var first = sheet.querySelector("a,button"); if (first) first.focus();
  }
  // Called by tools after a successful action. One gentle nudge after 3 uses, then quiet for 30 days.
  function done() {
    var n = (store("uses") || 0) + 1; store("uses", n);
    var last = store("nudged") || 0;
    if (n >= 3 && Date.now() - last > 30 * 864e5) {
      store("nudged", Date.now());
      setTimeout(function () {
        var t = toast("Saved you some time? ");
        var b = h("button", { "class": "btn coffee small", onclick: function () { t.remove(); openSupport(); } }, ["☕ Buy me a coffee"]);
        t.appendChild(b);
      }, 900);
    }
  }

  // ---------- shell ----------
  function current() { var slug = doc.body.getAttribute("data-tool"); return TOOLS.filter(function (t) { return t.slug === slug; })[0] || { slug: slug, name: doc.title }; }
  function header(tool) {
    var top = h("header", { "class": "s3-top" });
    top.innerHTML =
      '<a class="s3-brand" href="/" title="All tools"><img src="' + esc(KIT_BASE) + 'icon.svg" alt="" width="28" height="28"><span>' + esc(CONFIG.brand) + "</span>" +
      (tool.slug ? '<span class="s3-sep">/</span><span class="s3-tool">' + esc(tool.name) + "</span>" : "") + "</a>" +
      '<span class="s3-spacer"></span><nav>' +
      '<a class="btn ghost small" href="/">' + icon("grid") + '<span class="s3-lbl">All tools</span></a>' +
      '<button class="btn ghost icon small" data-theme-toggle aria-label="Toggle theme">' + icon("sun") + "</button>" +
      '<button class="btn coffee small" data-support>' + icon("coffee") + '<span class="s3-lbl">Support</span></button></nav>';
    return top;
  }
  function footer(tool) {
    var ad = (CONFIG.houseAds || [])[Math.floor(Math.random() * (CONFIG.houseAds || []).length)];
    var cat = tool.category, pool = TOOLS.filter(function (t) { return t.slug !== tool.slug; });
    pool.sort(function (a, b) { return (b.category === cat) - (a.category === cat) || (a.slug < b.slug ? -1 : 1); });
    var more = doc.body.getAttribute("data-more") === "off" ? [] : pool.slice(0, 8);
    var repo = tool.slug ? "https://github.com/" + CONFIG.owner + "/" + tool.slug : "https://github.com/" + CONFIG.owner;
    var f = h("footer", { "class": "s3-foot" });
    f.innerHTML = '<div class="s3-foot-in">' +
      '<div class="s3-support"><span class="s3-cup">☕</span><div class="s3-copy"><b>Free forever. No ads tracking you, no sign-up, no uploads.</b><span>If this helped, you can buy me a coffee. It keeps every tool free.</span></div>' +
      '<button class="btn coffee" data-support>' + icon("coffee") + " Buy me a coffee</button></div>" +
      (ad ? '<a class="s3-ad" href="' + esc(ad.url) + '" target="_blank" rel="noopener sponsored"><span class="s3-ad-tag">Ad</span><span><b>' + esc(ad.title) + "</b> — " + esc(ad.text) + "</span></a>" : "") +
      (more.length ? '<div class="s3-more"><h3>More free tools</h3><div class="s3-more-grid">' + more.map(function (t) {
        return '<a href="/' + esc(t.slug) + '/"><b>' + esc(t.name) + "</b><span>" + esc(t.tagline) + "</span></a>";
      }).join("") + "</div></div>" : "") +
      '<div class="s3-foot-row"><span>' + icon("lock") + ' Runs 100% in your browser. Your data never leaves this device.</span>' +
      '<span class="s3-links"><a href="/">All tools</a><a href="/coffee/">Support</a><a href="' + esc(repo) + '" target="_blank" rel="noopener">Source on GitHub</a><a href="/privacy/">Privacy</a></span></div>' +
      "</div>";
    return f;
  }
  function syncThemeIcon() {
    $$("[data-theme-toggle] use").forEach(function (u) { u.setAttribute("href", root.getAttribute("data-theme") === "dark" ? "#i-sun" : "#i-moon"); });
  }
  function mount() {
    var tool = current();
    doc.body.insertAdjacentHTML("afterbegin", sprite());
    if (doc.body.getAttribute("data-shell") !== "none") {
      var main = $("main") || doc.body;
      doc.body.insertBefore(header(tool), main);
      main.parentNode.insertBefore(footer(tool), main.nextSibling);
    }
    doc.addEventListener("click", function (e) {
      if (e.target.closest("[data-support]")) { e.preventDefault(); openSupport(); }
      if (e.target.closest("[data-theme-toggle]")) {
        var t = root.getAttribute("data-theme") === "dark" ? "light" : "dark"; setTheme(t); store("theme", t); syncThemeIcon();
      }
    });
    syncThemeIcon();
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", mount); else mount();

  window.S3 = {
    config: CONFIG, tools: TOOLS, $: $, $$: $$, h: h, esc: esc, store: store, toast: toast, copy: copy, download: download,
    drop: drop, readFile: readFile, fmtBytes: fmtBytes, debounce: debounce, zip: zip, crc32: crc32, icon: icon, done: done, support: openSupport
  };
})();
