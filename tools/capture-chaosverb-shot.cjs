/**
 * Re-render the Chaosverb product screenshot from the plugin's own webview UI.
 *
 * The site's plate (public/screenshots/chaosverb.webp) is not a hand-taken
 * screenshot — it's the real V1.1.1 UI, served standalone, driven to the
 * marketing state below, themed Daylight, and captured at 2x. When the plugin
 * UI changes (new version stamp, new controls), re-run this instead of
 * cropping a window grab:
 *
 *   npm i --no-save puppeteer-core        # one-off; keeps the lockfile clean
 *   node tools/capture-chaosverb-shot.cjs "D:/Work/Entropia Audio/Chaosverb-1.1.1/Chaosverb/Source/ui/public"
 *   ffmpeg -i chaosverb-2x.png -vf "crop=iw-12:ih-12:6:6" -quality 92 public/screenshots/chaosverb.webp
 *
 * then update screenshotSize in src/data/plugins.ts to the new file's pixels.
 * The 6px crop trims the capture's outermost pixels the same way the old
 * EDGE_CROP did, so the framing matches the site's historical shot.
 *
 * How it drives the UI: the page's knobs listen to JUCE slider states, and ES
 * module caching means importing js/juce/index.js here yields the SAME state
 * objects — so the script sets normalised values and fires the listeners.
 * Knob repaints are rAF-throttled, so each bisection step waits two frames
 * before trusting a label. Targets are the UI's own printed labels, bisected
 * against its own formatters — no mapping math to rot.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const UI_DIR = process.argv[2];
const DPR = parseFloat(process.argv[3] || "2");
const OUT = process.argv[4] || `chaosverb-${DPR}x.png`;
const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const W = 1249, H = 554; // the composed plate size (see the site's shot)

if (!UI_DIR || !fs.existsSync(path.join(UI_DIR, "index.html"))) {
  console.error("usage: node capture-chaosverb-shot.js <path-to-ui-public-dir> [dpr] [out.png]");
  process.exit(1);
}

// [paramId, target label exactly as the shot prints it]
const KNOBS = [
  ["decay", "38%"], ["preDelay", "0ms"], ["density", "60%"],
  ["gravity", "0"], ["spectralTilt", "0"], ["saturation", "25%"],
  ["lowCut", "602Hz"], ["tilt", "-10"], ["highCut", "15.6kHz"],
  ["modRate", "5Hz"], ["flutterSpeed", "50%"], ["wowFlutterAmount", "0%"],
  ["duckingAmount", "0%"], ["duckAttack", "1ms"], ["duckRelease", "265ms"],
  ["width", "100%"], ["mix", "50%"], ["outputLevel", "-4.0dB"],
];
const HSLIDERS = [
  ["hslider_mutationInterval", "mutationInterval", "1/8"],
  ["hslider_crossfadeSpeed", "crossfadeSpeed", "3 BAR"],
  ["hslider_mutationAmount", "mutationAmount", "44%"],
];

const MIME = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2", ".css": "text/css" };
const server = http.createServer((req, res) => {
  const p = path.join(UI_DIR, decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  fs.readFile(p.endsWith(path.sep) || p === UI_DIR ? path.join(UI_DIR, "index.html") : p, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": MIME[path.extname(p)] || "application/octet-stream" });
    res.end(data);
  });
});

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${server.address().port}/index.html`;

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--disable-gpu", "--hide-scrollbars", "--force-color-profile=srgb"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR });
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));

  // Daylight theme through the UI's own settings path, so the JS palette
  // (SECTION_COLORS, canvas knob arcs) repaints — not just the CSS skin.
  await page.evaluate(() => {
    const gear =
      document.querySelector("#settingsBtn") ||
      document.querySelector(".settings-btn") ||
      [...document.querySelectorAll("button")].find((b) => b.querySelector("svg circle"));
    gear.click();
    document.querySelector("#settingsThemeToggle").click();
    gear.click();
  });
  await new Promise((r) => setTimeout(r, 250));

  const report = await page.evaluate(
    async ({ KNOBS, HSLIDERS }) => {
      const juce = await import("/js/juce/index.js");
      const out = [];
      const setNorm = (name, v) => {
        const st = juce.getSliderState(name);
        st.setNormalisedValue(v);
        st.valueChangedEvent.callListeners();
      };
      const read = (el) => (el ? el.textContent.trim() : null);
      const frame = () =>
        new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const num = (s) => {
        if (s == null) return NaN;
        const m = String(s).replace(",", ".").match(/-?\d+(\.\d+)?/);
        if (!m) return NaN;
        let v = parseFloat(m[0]);
        if (/khz/i.test(s)) v *= 1000;
        return v;
      };
      const drive = async (name, labelEl, target) => {
        const t = num(target);
        let lo = 0, hi = 1, best = null, bestD = Infinity;
        for (let i = 0; i < 40; i++) {
          const mid = (lo + hi) / 2;
          setNorm(name, mid);
          await frame();
          const lab = read(labelEl);
          if (lab === target) return { name, label: lab, exact: true };
          const v = num(lab);
          const d = Math.abs(v - t);
          if (d < bestD) { bestD = d; best = mid; }
          if (isNaN(v) || v < t) lo = mid; else hi = mid;
        }
        setNorm(name, best);
        await frame();
        return { name, label: read(labelEl), exact: read(labelEl) === target };
      };
      // Discrete steppers (OFF / 1/32 / … / 8 BAR): walk the range.
      const driveSteps = (name, labelEl, target) => {
        for (let i = 0; i <= 400; i++) {
          setNorm(name, i / 400);
          if (read(labelEl) === target) return { name, label: target, exact: true };
        }
        return { name, label: read(labelEl), exact: false };
      };

      for (const [paramId, target] of KNOBS) {
        out.push(await drive(paramId, document.getElementById("knobVal_" + paramId), target));
      }
      for (const [containerId, stateName, target] of HSLIDERS) {
        const wrap = document.getElementById(containerId);
        const el = wrap.querySelector(".hslider-value") || wrap.querySelector("[class*='value']");
        out.push(driveSteps(stateName, el, target));
      }

      // Header: timer stopped (START showing), interval readout printed.
      const toggle = document.getElementById("timerToggle");
      if (toggle) toggle.textContent = "START";
      const cd = document.getElementById("countdown");
      if (cd) { cd.textContent = "429ms"; cd.classList.remove("stopped"); }
      return out;
    },
    { KNOBS, HSLIDERS }
  );

  const misses = report.filter((r) => !r.exact);
  console.table(report.map((r) => ({ param: r.name, label: r.label, exact: r.exact })));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: OUT });
  await browser.close();
  server.close();
  console.log(misses.length ? `wrote ${OUT} — ${misses.length} label(s) missed, check the table` : `wrote ${OUT}`);
})();
