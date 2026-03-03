require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const cheerio = require("cheerio");

const LOGIN_EMAIL = process.env.EWI_EMAIL;
const LOGIN_PASSWORD = process.env.EWI_PASSWORD;
const OUTPUT_FILE = "ewihub_employees.json";
const CONCURRENCY = 10;
const DELAY_MS = 500;
const MAX_RETRIES = 3;

const ATTR_ALIASES = {
  started: "startedOn",
  "started on": "startedOn",
  completed: "completedOn",
  "completed on": "completedOn",
  age: "age",
  height: "height",
  "dominant hand": "dominantHand",
  dominanthand: "dominantHand",
  handedness: "dominantHand",
  bifocals: "bifocals",
  "visual issue": "visualIssue",
  visualissue: "visualIssue",
  "computer time": "computerTime",
  computertime: "computerTime",
  "dual monitor": "dualMonitor",
  dualmonitor: "dualMonitor",
  "dual monitors": "dualMonitor",
  laptop: "laptop",
  "sit to stand": "sitToStand",
  sittostand: "sitToStand",
  "sit to stand desk": "sitToStand",
  demographic: "demographic",
  demographics: "demographic",
  discomfort: "discomfort",
  discomforts: "discomfortAreas",
  "discomfort areas": "discomfortAreas",
  discomfortareas: "discomfortAreas",
  "adjustment result": "adjustmentResult",
  adjustmentresult: "adjustmentResult",
  action: "actionNeeded",
  actions: "actionNeeded",
  "action needed": "actionNeeded",
  actionneeded: "actionNeeded",
  equipment: "equipmentNeeded",
  "equipment needed": "equipmentNeeded",
  equipmentneeded: "equipmentNeeded",
  result: "result",
  issues: "adjustmentResult",
};

const BODY_PART_ALIASES = {
  "upper-back": "upperBack",
  "mid-back": "midBack",
  "lower-back": "lowerBack",
  buttocks: "buttocks",
  head: "head",
  neck: "neck",
  eyes: "eyes",
  "left-shoulder": "leftShoulder",
  "right-shoulder": "rightShoulder",
  "left-upper-arm": "leftUpperArm",
  "right-upper-arm": "rightUpperArm",
  "left-elbow": "leftElbow",
  "right-elbow": "rightElbow",
  "left-lower-arm": "leftLowerArm",
  "right-lower-arm": "rightLowerArm",
  "left-wrist": "leftWrist",
  "right-wrist": "rightWrist",
  "left-hand": "leftHand",
  "right-hand": "rightHand",
  "left-thigh": "leftThigh",
  "right-thigh": "rightThigh",
  "left-knee": "leftKnee",
  "right-knee": "rightKnee",
  "left-lower-leg": "leftLowerLeg",
  "right-lower-leg": "rightLowerLeg",
  "left-foot-or-ankle": "leftFootOrAnkle",
  "right-foot-or-ankle": "rightFootOrAnkle",
};

function normaliseAttrKey(raw) {
  const lower = raw
    .toLowerCase()
    .replace(/[_\-]+/g, " ")
    .trim();
  return ATTR_ALIASES[lower] || lower;
}

if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
  console.error("❌ EWI_EMAIL or EWI_PASSWORD is not set in .env.local");
  process.exit(1);
}

class Session {
  constructor() {
    this.cookies = {};
  }

  _storeCookies(res) {
    const raw =
      res.headers.getSetCookie?.() ?? res.headers.raw?.()["set-cookie"] ?? [];
    for (const c of raw) {
      const [pair] = c.split(";");
      const [name, ...rest] = pair.split("=");
      this.cookies[name.trim()] = rest.join("=").trim();
    }
  }

  _cookieHeader() {
    return Object.entries(this.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  async fetch(url, opts = {}) {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
      Cookie: this._cookieHeader(),
      ...opts.headers,
    };

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch(url, {
          ...opts,
          headers,
          redirect: "manual",
        });

        this._storeCookies(res);

        if ([301, 302, 303, 307, 308].includes(res.status)) {
          const location = res.headers.get("location");
          if (location) {
            const next = new URL(location, url).href;
            return this.fetch(next);
          }
        }

        return res;
      } catch (err) {
        if (attempt < MAX_RETRIES) {
          const wait = attempt * 2000;
          console.warn(
            `  ⚠ Fetch failed for ${url} (attempt ${attempt}/${MAX_RETRIES}), retrying in ${wait}ms...`,
          );
          await new Promise((r) => setTimeout(r, wait));
        } else {
          throw err;
        }
      }
    }
  }
}

function extractCsrfToken(html) {
  const $ = cheerio.load(html);
  return $('input[name="_token"]').val();
}

function parseEmployeeLinks(html) {
  const $ = cheerio.load(html);
  const links = [];
  $("#tblReport tbody tr a.employee-link").each((_, el) => {
    const href = $(el).attr("href");
    if (href)
      links.push(href.startsWith("http") ? href : `https://ewihub.com${href}`);
  });
  return links;
}

function parseBodyDiagram($) {
  const diagram = {};
  let found = false;

  $(".body-part-text").each((_, el) => {
    const classes = $(el).attr("class") || "";
    const match = classes.match(/([\w-]+)-text\s+body-part-text/);
    if (!match) return;

    const rawPart = match[1];
    const camel = BODY_PART_ALIASES[rawPart] || rawPart;
    const severity = parseInt($(el).text().trim(), 10);

    if (!isNaN(severity)) {
      diagram[camel] = severity;
      found = true;
    }
  });

  if (!found) {
    $(".body-part").each((_, el) => {
      const tag = (el.tagName || el.name || "").toLowerCase();
      if (tag !== "path") return;

      const classes = $(el).attr("class") || "";
      const match = classes.match(/([\w-]+)\s+body-part\s+spectrum-(\d+)/);
      if (!match) return;

      const rawPart = match[1];
      if (rawPart === "left-eye" || rawPart === "right-eye") return;

      const camel = BODY_PART_ALIASES[rawPart] || rawPart;
      const severity = parseInt(match[2], 10);

      if (!isNaN(severity)) {
        diagram[camel] = severity;
        found = true;
      }
    });

    if (!diagram.eyes) {
      $("path.eyes").each((_, el) => {
        const classes = $(el).attr("class") || "";
        const m = classes.match(/spectrum-(\d+)/);
        if (m && !diagram.eyes) {
          diagram.eyes = parseInt(m[1], 10);
          found = true;
        }
      });
    }
  }

  return found ? diagram : null;
}

function parseEmployeeProfile(html, profileUrl) {
  const $ = cheerio.load(html);

  const name = $(".widget-user-username").text().trim() || "Unknown";
  const email = $(".widget-user-desc").text().trim() || "Unknown";
  const trainings = [];
  const bodyDiagram = parseBodyDiagram($);

  $(".timeline-item").each((_, item) => {
    const courseName = $(item).find(".timeline-header a").text().trim();
    if (!courseName) return;

    const status = $(item).find(".ribbon").text().trim() || "Unknown";
    const attributes = {};

    $(item)
      .find(".timeline-body table tr")
      .each((_, row) => {
        const rawKey = $(row).find("th").text().trim().replace(/:$/, "");
        let val = $(row)
          .find("td")
          .html()
          ?.replace(/<br\s*\/?>/gi, ", ")
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replace(/\s\s+/g, " ")
          .trim();
        if (val?.endsWith(",")) val = val.slice(0, -1);

        if (rawKey && val) {
          const key = normaliseAttrKey(rawKey);
          attributes[key] = val;
        }
      });

    const trainingEntry = { course: courseName, status, attributes };
    if (/self.?assessment/i.test(courseName) && bodyDiagram) {
      trainingEntry.bodyDiagram = bodyDiagram;
    }

    trainings.push(trainingEntry);
  });

  return { name, email, trainings, bodyDiagram, profileUrl };
}

async function mapWithConcurrency(items, fn, concurrency) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

(async () => {
  const session = new Session();

  try {
    console.log("Fetching login page...");
    const loginPageRes = await session.fetch("https://ewihub.com/login");
    const loginPageHtml = await loginPageRes.text();
    const token = extractCsrfToken(loginPageHtml);

    if (!token) throw new Error("Could not find CSRF _token on login page");

    console.log(`Logging in as ${LOGIN_EMAIL}...`);
    const loginRes = await session.fetch("https://ewihub.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        _token: token,
        email: LOGIN_EMAIL,
        password: LOGIN_PASSWORD,
        remember: "on",
      }).toString(),
    });

    const postLoginHtml = await loginRes.text();
    if (postLoginHtml.includes("These credentials do not match")) {
      throw new Error("Login failed — bad credentials");
    }
    console.log("✅ Logged in!");

    console.log("Fetching employee directory...");
    const empRes = await session.fetch(
      "https://ewihub.com/employees?length=-1",
    );
    let empHtml = await empRes.text();

    let links = parseEmployeeLinks(empHtml);

    if (links.length === 0) {
      const empRes2 = await session.fetch("https://ewihub.com/employees");
      empHtml = await empRes2.text();
      links = parseEmployeeLinks(empHtml);
    }

    console.log(`Found ${links.length} employee links.`);

    if (links.length === 0) {
      console.warn(
        "⚠️  No links found in HTML. The table may load via AJAX — check the page source for the DataTables ajax URL.",
      );
      console.log("Saving raw HTML to _debug_employees.html for inspection.");
      fs.writeFileSync("_debug_employees.html", empHtml);
      process.exit(1);
    }

    console.log(
      `Scraping ${links.length} profiles (concurrency: ${CONCURRENCY})...`,
    );
    const employees = await mapWithConcurrency(
      links,
      async (url, i) => {
        console.log(`  [${i + 1}/${links.length}] ${url}`);
        const res = await session.fetch(url);
        const html = await res.text();
        const data = parseEmployeeProfile(html, url);

        if (data.bodyDiagram) {
          const nonZero = Object.values(data.bodyDiagram).filter(
            (v) => v > 0,
          ).length;
          if (nonZero > 0) {
            console.log(
              `    🦴 Body diagram: ${nonZero} area(s) with discomfort`,
            );
          }
        }

        if ((i + 1) % 50 === 0) {
          console.log(`  💾 Progress save at ${i + 1} records...`);
        }

        await new Promise((r) => setTimeout(r, DELAY_MS));
        return data;
      },
      CONCURRENCY,
    );

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(employees, null, 2));
    console.log(
      `\n✅ Done! Scraped ${employees.length} records → ${OUTPUT_FILE}`,
    );
  } catch (err) {
    console.error("\n❌ Error:", err);
    process.exit(1);
  }
})();
