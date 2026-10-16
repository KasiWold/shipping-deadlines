// Shipping Deadlines
// Every shipping opportunity starting from January 2027, ranked by how directly it leads to
// becoming a shipbroker at Clarksons:
//   Tier 1  Clarksons itself (gold)        Tier 2  other shipbroking firms (white)
//   Tier 3  chartering desks (light grey)  Tier 4  other shipping or commodity roles (grey)
// iPhone home screen + lock screen widgets for the Scriptable app. Free, runs on the phone.
//
// Four layers keep it current:
//   1. MASTER LIST: researched by Claude. A scheduled research run updates it twice a week and,
//      once REMOTE_URL is set, the widget downloads the new list automatically.
//   2. WATCHERS: every 6 hours the phone reads each company's careers page. A published deadline
//      replaces the estimate, "applications open" turns the row green, and any change to the page
//      flags the row "updated" until you open it.
//   3. LIVE FEEDS: new shipping student / trainee / intern ads from Jobindex (DK), finn.no (NO)
//      and Google News, ranked by the same tiers.
//   4. COUNTDOWNS: recalculated on every refresh; passed deadlines drop off by themselves.
//
// Widget sizes (no parameter needed):
//   Medium  -> "APPLY NEXT": the most urgent things to act on
//   Large   -> full tracker: open now, opening soon, new postings
//   Lock screen rectangular / inline -> next deadline
// Optional Widget Parameter: "next" or "tracker" to force a view.
//
// Tap a row to open the posting. Tap a header to open the full list, where you can
// mark programmes as applied (they then drop out of the widgets).

// Where the scheduled research run publishes the updated master list (your GitHub repository).
// If it can't be reached, the widget uses the last downloaded copy, then the built-in list below.
const REMOTE_URL = "https://raw.githubusercontent.com/KasiWold/shipping-deadlines/main/opportunities.json";
const REMOTE_HOURS = 12;

// ================= TRACKED PROGRAMMES =================
// tier: 1 Clarksons, 2 shipbroker, 3 chartering desk, 4 other shipping.
// status: "open" (has deadline), "rolling" (no deadline, apply any time),
//         "expected" (not open yet; opens = usual opening date, est = true if estimated),
//         "closed"
// Dates are YYYY-MM-DD. Add, edit or delete entries freely.

let VERIFIED = "16 Oct 2026";

let TRACKED = [
  {
    "id": "clarksons-dk-intern-2027",
    "company": "Clarksons",
    "role": "Shipbroker Intern 2027 (one year, full-time)",
    "place": "Hellerup, Copenhagen",
    "tier": 1,
    "start": "2027, one-year contract",
    "status": "expected",
    "opens": "2026-11-01",
    "est": true,
    "url": "https://careers.clarksons.com/search/?q=&locationsearch=Hellerup",
    "watch": [
      "https://careers.clarksons.com/search/?q=&locationsearch=Hellerup",
      "https://careers.clarksons.com/search/?q=intern"
    ],
    "watchKey": "intern|hellerup|copenhagen",
    "note": "Clarksons Denmark hired a one-year full-time Shipbroker Intern for 2026 (now filled), and a 2027 version is likely this winter. Your placement at Clarksons Copenhagen is your best lever here, so ask your contact there now when it opens."
  },
  {
    "id": "clarksons-gtbp-2027",
    "company": "Clarksons",
    "role": "Global Trainee Broker Programme 2027",
    "place": "Oslo, Hamburg, Geneva and more",
    "tier": 1,
    "start": "Autumn 2027 (2026 cohort started 28 Sept)",
    "status": "expected",
    "opens": "2026-12-01",
    "est": true,
    "deadline": "2027-02-15",
    "deadlineEst": true,
    "url": "https://www.clarksons.com/home/careers/early-careers/global-trainee-broker-programme/",
    "watch": [
      "https://www.clarksons.com/home/careers/early-careers/global-trainee-broker-programme/",
      "https://careers.clarksons.com/search/?q=trainee"
    ],
    "watchKey": "trainee|programme|program|applications",
    "note": "The flagship route to becoming a Clarksons broker. Last round, London closed 16 Feb 2026 and other offices stayed open longer. Two years with first-year rotations; Oslo had its own 2026 listing."
  },
  {
    "id": "mb-student-market-research",
    "company": "MB Shipbrokers",
    "role": "Student Assistant, Market Research",
    "place": "Copenhagen",
    "tier": 2,
    "start": "Part-time, check if January works",
    "status": "open",
    "deadline": "2026-10-30",
    "url": "https://jobs.mbshipbrokers.com/hrmeasy_recruitment.nsf/0/029DB3A9AE8B284EC1258E90002E456A?opendocument",
    "watch": "https://jobs.mbshipbrokers.com/hrmeasy_recruitment.nsf/ShowJobList?OpenAgent",
    "watchKey": "market research",
    "note": "Two openings: one supporting the container team, one the bulk/tanker team. Deadline confirmed on MB's own job list.",
    "anyDate": true
  },
  {
    "id": "mb-unsolicited",
    "company": "MB Shipbrokers",
    "role": "Unsolicited application",
    "place": "Copenhagen and offices",
    "tier": 2,
    "start": "Flexible",
    "status": "rolling",
    "url": "https://jobs.mbshipbrokers.com/hrmeasy_recruitment.nsf/0/82046AF7789368DCC1257D5700262C39?opendocument",
    "note": "Open year-round through their job portal. Useful for flagging interest in the 2027 trainee intake early."
  },
  {
    "id": "howe-robinson-trainee",
    "company": "Howe Robinson",
    "role": "Trainee Shipbroker",
    "place": "All offices",
    "tier": 2,
    "start": "Flexible",
    "status": "rolling",
    "url": "https://www.howerobinson.com/directory/careers/trainee-shipbroker/",
    "watch": "https://www.howerobinson.com/directory/careers/trainee-shipbroker/",
    "note": "Send CV and cover letter to recruitment@howerob.com quoting reference TR20. Ask specifically about their non-UK offices."
  },
  {
    "id": "fearnleys-open",
    "company": "Fearnleys",
    "role": "Open application, shipbroking",
    "place": "Oslo, Geneva and more",
    "tier": 2,
    "start": "Flexible",
    "status": "rolling",
    "url": "https://fearnleys.com/careers/",
    "watch": "https://fearnleys.com/careers/",
    "note": "Letter, CV, transcripts and references to career@fearnleys.com."
  },
  {
    "id": "grieg-open",
    "company": "Grieg Shipbrokers",
    "role": "Open application",
    "place": "Bergen, Oslo",
    "tier": 2,
    "start": "Flexible",
    "status": "rolling",
    "url": "https://grieg.no/?p=945",
    "watch": "https://grieg.no/?p=945",
    "note": "General open application on their careers page. They also run summer intern places in Bergen."
  },
  {
    "id": "lightship-open",
    "company": "Lightship Chartering",
    "role": "Open application (trainee/junior)",
    "place": "Copenhagen, Oslo, Geneva and more",
    "tier": 2,
    "start": "Flexible; Academy trainees start every September",
    "status": "rolling",
    "url": "https://www.lightshipchartering.com/career",
    "watch": "https://www.lightshipchartering.com/career",
    "note": "Their 2026/2027 Academy round is closed, but they take unsolicited applications at applications@lightshipchartering.com."
  },
  {
    "id": "ifchor-igtp-2027",
    "company": "Ifchor Galbraiths",
    "role": "IG Talent Programme 2027",
    "place": "Lausanne, Geneva and global",
    "tier": 2,
    "start": "2027 (month not confirmed)",
    "status": "expected",
    "opens": "2026-11-15",
    "est": true,
    "deadline": "2027-01-31",
    "deadlineEst": true,
    "url": "https://ifchorgalbraiths.com/careers/",
    "watch": "https://ifchorgalbraiths.com/careers/",
    "watchKey": "talent|igtp|trainee|applications",
    "note": "12-month shipbroking programme. The 2026 round closed 31 January 2026."
  },
  {
    "id": "steem1960-trainee",
    "company": "Steem1960",
    "role": "Shipbroker Trainee Program",
    "place": "Oslo",
    "tier": 2,
    "start": "August 2027",
    "status": "expected",
    "opens": "2026-12-01",
    "est": true,
    "deadline": "2027-01-21",
    "deadlineEst": true,
    "url": "https://www.finn.no/job/search?q=Steem1960",
    "note": "12-month programme. The 2026 round (August start) was posted on finn.no and closed 21 January 2026. The finn.no feed in the widget picks up the new ad."
  },
  {
    "id": "fearnleys-summer-2027",
    "company": "Fearnleys",
    "role": "Summer Internship 2027",
    "place": "Oslo, Geneva and more",
    "tier": 2,
    "start": "Summer 2027",
    "status": "expected",
    "opens": "2027-01-15",
    "est": true,
    "deadline": "2027-03-01",
    "deadlineEst": true,
    "url": "https://fearnleys.com/careers/",
    "watch": "https://fearnleys.com/careers/",
    "watchKey": "intern",
    "note": "Previous London and Singapore rounds closed 1 March. Oslo and Geneva dates are not published, so ask career@fearnleys.com now."
  },
  {
    "id": "mb-trainee-2027",
    "company": "MB Shipbrokers",
    "role": "Shipbroker Trainee Programme 2027",
    "place": "Copenhagen and Asia",
    "tier": 2,
    "start": "September 2027",
    "status": "expected",
    "opens": "2027-03-01",
    "est": true,
    "deadline": "2027-04-30",
    "deadlineEst": true,
    "url": "https://jobs.mbshipbrokers.com/hrmeasy_recruitment.nsf/ShowJobList?OpenAgent",
    "watch": "https://jobs.mbshipbrokers.com/hrmeasy_recruitment.nsf/ShowJobList?OpenAgent",
    "watchKey": "trainee",
    "note": "Recruits in March-April. Two years with the Danish Shipping Academy, then a permanent job.",
    "anyDate": true
  },
  {
    "id": "brs-graduate",
    "company": "BRS Shipbrokers",
    "role": "Graduate Program",
    "place": "Paris, Geneva and other offices",
    "tier": 2,
    "start": "2027 (month not confirmed)",
    "status": "expected",
    "est": true,
    "url": "https://www.brsshipbrokers.com/careers",
    "watch": "https://www.brsshipbrokers.com/careers",
    "watchKey": "graduate",
    "note": "12-month programme rotating through offices and departments. Closed now with no 2027 dates, so also send an unsolicited CV through the page."
  },
  {
    "id": "torm-student",
    "company": "TORM",
    "role": "Student Assistant (commercial/chartering)",
    "place": "Copenhagen",
    "tier": 3,
    "start": "Flexible",
    "status": "rolling",
    "url": "https://www.torm.com/careers/careers-in-office/programs-in-office/default.aspx",
    "watch": "https://candidate.hr-manager.net/vacancies/list.aspx?customer=torm",
    "watchKey": "student",
    "note": "Product tanker owner. Student assistants (15-20 h/week) are hired as departments need them; set up TORM's job agent to be told first."
  },
  {
    "id": "cargill-ot-academy",
    "company": "Cargill Ocean Transportation",
    "role": "Ocean Transportation Academy Trainee",
    "place": "Geneva/Amsterdam (Schiphol)",
    "tier": 3,
    "start": "Around June 2027",
    "status": "expected",
    "opens": "2026-11-15",
    "est": true,
    "url": "https://careers.cargill.com/en/job/schiphol/ocean-transportation-academy-trainee-m-f-d/23251/90269551328",
    "note": "Chartering and freight trading desk of one of the largest charterers. The 2026 intake started in June; 2027 dates are not published yet."
  },
  {
    "id": "norden-trainee",
    "company": "Norden",
    "role": "Shipping Trainee, Chartering/Operations",
    "place": "Copenhagen",
    "tier": 3,
    "start": "Aug/Sept 2027",
    "status": "expected",
    "opens": "2027-02-15",
    "est": true,
    "deadline": "2027-03-30",
    "deadlineEst": true,
    "url": "https://www.jobindex.dk/jobsoegning?q=norden%20shipping%20trainee",
    "note": "Dry bulk and tankers. Previous rounds closed 16 March and 27 April 2025. Includes the Danish Shipping Academy."
  },
  {
    "id": "stena-bulk-trainee",
    "company": "Stena Bulk",
    "role": "Shipping Trainee",
    "place": "Copenhagen",
    "tier": 3,
    "start": "Mid-August 2027",
    "status": "expected",
    "opens": "2027-03-01",
    "est": true,
    "url": "https://career.stena.com/jobs/7322946-shipping-trainee",
    "note": "Tankers. Two-year programme with the Danish Shipping Academy."
  },
  {
    "id": "centalion-graduate",
    "company": "Centalion (formerly Gunvor)",
    "role": "Global Graduate Program",
    "place": "Geneva, Singapore, Houston",
    "tier": 4,
    "start": "2027",
    "status": "open",
    "deadline": "2026-10-31",
    "deadlineEst": true,
    "url": "https://centalion.com/careers/graduate-program",
    "watch": "https://centalion.com/careers/graduate-program",
    "watchKey": "applications|deadline|graduate",
    "note": "Applications open now. Commodity trader with its own shipping arm (Clearlake Shipping). Degree must be finished by June 2027. Last year's window closed 31 October, so apply this month."
  },
  {
    "id": "wilhelmsen-summer-2027",
    "company": "Wilhelmsen",
    "role": "Summer Internship 2027",
    "place": "Lysaker, Oslo",
    "tier": 4,
    "start": "June 2027 (6 weeks)",
    "status": "open",
    "deadline": "2026-10-25",
    "url": "https://www.finn.no/job/search?q=Wilhelmsen%20Summer%20Internship%202027",
    "note": "Shipowner and ship manager. Project in weeks 24-26 and 30-32. Students graduating in 2028 are prioritised."
  }
];

// ================= LIVE SOURCES =================

const JOBINDEX_QUERIES = ["shipbroker", "shipbroking", "shipping trainee", "chartering", "befragtning"];
// Only keep live postings aimed at students and new graduates
const ENTRY_LEVEL = /(student|trainee|intern|graduate|junior|praktik|elev|summer)/i;
// Live postings must mention shipping in the job title or company name, which stops
// generic "Student Assistant" ads from unrelated companies getting through
const SHIPPING_WORDS = /(\bship|shipping|shipbrok|broker|broking|chartering|befragt|freight|\bfragt|maritime|\bmarine|tanker|\bbulk|vessel|rederi|dampskib|\bocean|offshore|\blng\b|\blpg\b|bunker|maersk|norden|torm|hafnia|dfds|ultrabulk|lauritzen|stena|evergas|monjasa|navig8|clarksons|fearnley|steem|lightship)/i;
// Live postings get the same tiers as the master list
const CHARTERING_WORDS = /(charter|befragt|freight|fragt|tanker|bulk|norden|torm|hafnia|maersk|ultrabulk|lauritzen|stena|cargill|trafigura|gunvor|centalion|vitol|klaveness|odfjell)/i;
function tierOf(text) {
  if (/clarksons/i.test(text)) return 1;
  if (BROKER_WORDS.test(text)) return 2;
  if (CHARTERING_WORDS.test(text)) return 3;
  return 4;
}
// Shipbroking postings are ranked above other shipping postings
const BROKER_WORDS = /(broker|broking|brokering|mægler)/i;
const NEWS_QUERY = '("trainee broker" OR "shipbroking trainee" OR "shipbroker trainee" OR "shipbroking internship" OR "shipbroker internship" OR "shipping trainee") when:30d';

const FINN_QUERIES = ["shipbroker", "shipping", "chartering"];

const LIVE_FEEDS = [
  ...JOBINDEX_QUERIES.map((q) => ({
    name: "Jobindex",
    kind: "jobindex",
    url: "https://www.jobindex.dk/jobsoegning.rss?q=" + encodeURIComponent(q),
  })),
  ...FINN_QUERIES.map((q) => ({
    name: "finn.no",
    kind: "finn",
    url: "https://www.finn.no/job/search?q=" + encodeURIComponent(q),
  })),
  {
    name: "Google News",
    kind: "news",
    url: "https://news.google.com/rss/search?q=" + encodeURIComponent(NEWS_QUERY) + "&hl=en-US&gl=US&ceid=US:en",
  },
];

const LIVE_MAX_AGE_DAYS = 45;
const WATCH_HOURS = 6;          // how often each careers page is re-read
const CACHE_HOURS = 3;          // live postings change slowly, this saves data
const REFRESH_MINUTES = 60;     // countdowns only change daily
const SIZE_OVERRIDE = null;     // e.g. { large: 13 } if the bottom of the large widget gets cut off

const C = {
  bgTop: new Color("#131b24"),
  bgBottom: new Color("#0a0f14"),
  text: new Color("#e8edf3"),
  dim: new Color("#8b949e"),
  red: new Color("#ff5f56"),
  amber: new Color("#ffb347"),
  green: new Color("#3ddc84"),
  blue: new Color("#38bdf8"),
  grey: new Color("#a0a8b3"),
  gold: new Color("#f2c14e"),
  line: new Color("#ffffff", 0.12),
};

// ================= STORAGE =================

const fm = FileManager.local();
const CACHE = fm.joinPath(fm.cacheDirectory(), "shipping-deadlines-live-v2.json");
const STATE = fm.joinPath(fm.documentsDirectory(), "shipping-deadlines-state.json");

function readJSON(path, fallback) {
  try { return fm.fileExists(path) ? JSON.parse(fm.readString(path)) : fallback; } catch (e) { return fallback; }
}
function writeJSON(path, obj) {
  try { fm.writeString(path, JSON.stringify(obj)); } catch (e) {}
}

function itemKey(it) { return (it.company + "|" + it.role).toLowerCase(); }

// ================= DATES =================

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseDay(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function today() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
function fmtDay(d) { return d ? d.getDate() + " " + MON[d.getMonth()] : ""; }
function fmtMonth(d) { return d ? MON[d.getMonth()] : ""; }
function clock(t) {
  if (!t) return "";
  const d = new Date(t);
  const p = (x) => String(x).padStart(2, "0");
  return p(d.getHours()) + ":" + p(d.getMinutes());
}
function ago(t) {
  if (!t) return "";
  const days = Math.max(0, Math.floor((Date.now() - t) / 86400000));
  return days === 0 ? "today" : days + "d ago";
}

// ================= EVALUATE TRACKED =================
// Turns each tracked entry into what it means today.

function evaluate(it, applied, watch) {
  const ws = watch ? [].concat(it.watch || []).map((u) => watch[u]).filter(Boolean) : [];
  let src = it;
  const key = it.watchKey ? new RegExp(it.watchKey, "i") : null;
  const t = today();
  const found = ws.flatMap((w) => w.cands || []).filter((c) => (!c.weak || it.anyDate) && (!key || key.test(c.s)) && parseDay(c.d) >= t).map((c) => c.d).sort()[0] || null;
  const saysOpen = ws.some((w) => (w.opens || []).some((x) => !key || key.test(x)));
  const changed = ws.some((w) => w.seen && w.hash !== w.seen);
  if (found && it.status !== "rolling") {
    // the company's own page now shows a deadline: use the real date
    src = Object.assign({}, it, { status: "open", deadline: found, deadlineEst: false, auto: true });
  } else if (saysOpen && it.status === "expected") {
    src = Object.assign({}, it, { status: "nowopen" });
  }
  const e = baseEvaluate(src, applied);
  if (changed) {
    e.changed = true;
    if (e.state === "soon") {
      e.state = "check";
      e.dateLabel = "Check";
      e.sort = 350;
    }
    if (e.state !== "open") {
      e.chip = "updated";
      e.color = C.amber;
    }
  }
  return e;
}

function baseEvaluate(it, applied) {
  const t = today();
  const dl = parseDay(it.deadline);
  const op = parseDay(it.opens);
  const e = Object.assign({}, it, { applied: !!applied[itemKey(it)] });

  if (it.status === "closed" || (dl && dl < t && (!it.deadlineEst || it.status === "open"))) {
    e.state = "missed";
    e.dateLabel = dl ? fmtDay(dl) : "closed";
    e.chip = "closed";
    e.color = C.dim;
    e.sort = dl ? -daysBetween(dl, t) : -999;
    return e;
  }

  if (it.status === "open" && dl) {
    const left = daysBetween(t, dl);
    e.state = "open";
    e.days = left;
    e.dateLabel = (it.deadlineEst ? "~" : "") + fmtDay(dl);
    e.chip = left === 0 ? "today" : left + "d";
    e.color = left <= 7 ? C.red : left <= 21 ? C.amber : C.green;
    e.sort = left;
    return e;
  }

  if (it.status === "rolling") {
    e.state = "rolling";
    e.dateLabel = "Rolling";
    e.chip = "now";
    e.color = C.blue;
    e.sort = 500;
    return e;
  }

  if (it.status === "nowopen") {
    e.state = "check";
    e.dateLabel = "Open";
    e.chip = "open!";
    e.color = C.green;
    e.sort = 300;
    return e;
  }

  // expected
  if (op && op <= t) {
    // usual opening date has passed: may be open now
    e.state = "check";
    e.dateLabel = dl ? "~" + fmtDay(dl) : "Check";
    e.chip = "check";
    e.color = C.amber;
    e.sort = 400 + (dl ? daysBetween(t, dl) / 1000 : 0);
    return e;
  }
  const until = op ? daysBetween(t, op) : 999;
  e.state = "soon";
  e.days = until;
  e.dateLabel = op ? (it.est ? "~" : "") + fmtMonth(op) : "TBA";
  e.chip = op ? "in " + until + "d" : "";
  e.color = C.grey;
  e.sort = 1000 + until;
  return e;
}

function buildTracker(state, watch) {
  const applied = state.applied || {};
  const rank = (e) => {
    const group = { open: 0, check: 1, rolling: 2, soon: 3, missed: 4 }[e.state];
    return [group, e.tier || (e.broker === false ? 3 : 2), e.sort];
  };
  const all = TRACKED.map((it) => evaluate(it, applied, watch)).sort((a, b) => {
    const x = rank(a), y = rank(b);
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  });
  return {
    act: all.filter((e) => !e.applied && (e.state === "open" || e.state === "rolling" || e.state === "check")),
    soon: all.filter((e) => !e.applied && e.state === "soon"),
    applied: all.filter((e) => e.applied && e.state !== "missed"),
  };
}

// ================= REMOTE MASTER LIST =================

const REMOTE_CACHE = fm.joinPath(fm.documentsDirectory(), "shipping-deadlines-remote.json");

async function loadRemote(maxAgeHours) {
  if (!REMOTE_URL) return;
  let cache = readJSON(REMOTE_CACHE, null);
  if (!cache || Date.now() - (cache.fetched || 0) > maxAgeHours * 3600000) {
    try {
      const req = new Request(REMOTE_URL + (REMOTE_URL.includes("?") ? "&" : "?") + "t=" + Date.now());
      req.timeoutInterval = 10;
      const data = await req.loadJSON();
      if (data && Array.isArray(data.items) && data.items.length) {
        cache = { fetched: Date.now(), data };
        writeJSON(REMOTE_CACHE, cache);
      }
    } catch (e) {}
  }
  if (cache && cache.data && Array.isArray(cache.data.items) && cache.data.items.length) {
    TRACKED = cache.data.items;
    if (cache.data.verified) {
      const d = parseDay(cache.data.verified);
      VERIFIED = d ? d.getDate() + " " + MON[d.getMonth()] + " " + d.getFullYear() : cache.data.verified;
    }
  }
}

// ================= CAREERS PAGE WATCHERS =================

const WATCH_FILE = fm.joinPath(fm.documentsDirectory(), "shipping-deadlines-watch.json");
const UA = { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" };
const MONTH_KEYS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, mai: 4, maj: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, okt: 9, nov: 10, dec: 11, des: 11 };
const RELEVANT = /(appl|deadline|closing|closes|trainee|intern|graduate|programme|program|vacanc|position|opening|recruit|søknad|frist|ansøg|stilling|2027|2028)/i;
const DEADLINE_WORDS = /(deadline|closing|closes|close on|close by|apply by|apply before|applications? close|no later than|søknadsfrist|frist|ansøgningsfrist|senest)/i;
const OPEN_WORDS = /(applications?\s+(are\s+)?(now\s+)?open|apply now|now accepting|now recruiting|we are recruiting|applications? for (our |the )?20(27|28) (intake |programme |program )?(are |is )?open)/i;
const CLOSED_WORDS = /(closed|no vacanc|not currently recruiting)/i;

function iso(d) {
  const p = (x) => String(x).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

function makeDate(y, m, d) {
  if (isNaN(y) || isNaN(m) || isNaN(d) || m < 0 || m > 11 || d < 1 || d > 31) return null;
  const x = new Date(y, m, d);
  return x.getMonth() === m ? x : null;
}

function findDates(s) {
  const out = [];
  let m;
  const a = /(\d{1,2})(?:st|nd|rd|th)?\.?\s+(?:of\s+)?([A-Za-zæøåÆØÅ]{3,})\.?,?\s+(\d{4})/g;
  while ((m = a.exec(s))) { const mo = MONTH_KEYS[m[2].slice(0, 3).toLowerCase()]; if (mo !== undefined) out.push(makeDate(+m[3], mo, +m[1])); }
  const b = /([A-Za-z]{3,})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/g;
  while ((m = b.exec(s))) { const mo = MONTH_KEYS[m[1].slice(0, 3).toLowerCase()]; if (mo !== undefined) out.push(makeDate(+m[3], mo, +m[2])); }
  const c = /\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b/g;
  while ((m = c.exec(s))) out.push(makeDate(+m[3], +m[2] - 1, +m[1]));
  const d = /\b(\d{4})-(\d{2})-(\d{2})\b/g;
  while ((m = d.exec(s))) out.push(makeDate(+m[1], +m[2] - 1, +m[3]));
  return out.filter(Boolean);
}

function pageText(html) {
  return decode(html
    .replace(/<(script|style|noscript|svg|nav|footer|header)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " "));
}

function hashText(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return String(h >>> 0);
}

// Reads one careers page: a fingerprint of the hiring-related text, any upcoming deadline,
// and whether it says applications are open or closed
function analyse(html) {
  const sentences = pageText(html)
    .split(/\n+|[.!?]\s+/)
    .map((x) => x.replace(/\s+/g, " ").trim())
    .filter((x) => x.length > 3 && x.length < 400 && RELEVANT.test(x));
  const t = today();
  const horizon = new Date(t.getTime() + 400 * 86400000);
  const ctx = (i) => sentences.slice(Math.max(0, i - 2), i + 1).join(" ").slice(-300).toLowerCase();
  const cands = [];
  const opens = [];
  sentences.forEach((x, i) => {
    // dates next to a deadline word are strong; any other future date is weak and only used
    // for job lists laid out as tables (title | department | date), see anyDate
    const strong = DEADLINE_WORDS.test(x);
    for (const d of findDates(x)) if (d >= t && d <= horizon) cands.push({ d: iso(d), s: strong ? ctx(i) : x.toLowerCase(), weak: !strong });
    if (OPEN_WORDS.test(x) && !CLOSED_WORDS.test(x)) opens.push(ctx(i));
  });
  return { hash: hashText(sentences.join("|")), cands: cands.slice(0, 40), opens: opens.slice(0, 10) };
}

async function getWatch(maxAgeHours) {
  const store = readJSON(WATCH_FILE, {});
  const urls = [...new Set(TRACKED.flatMap((t) => [].concat(t.watch || [])))];
  const stale = urls.filter((u) => !store[u] || Date.now() - (store[u].checked || 0) > maxAgeHours * 3600000);
  if (!stale.length) return store;
  await Promise.all(stale.map(async (u) => {
    try {
      const req = new Request(u);
      req.timeoutInterval = 10;
      req.headers = UA;
      const html = await req.loadString();
      if (req.response && req.response.statusCode >= 400) return;
      if (!html || html.length < 500) return;
      const a = analyse(html);
      const prev = store[u] || {};
      store[u] = {
        hash: a.hash,
        seen: prev.seen || a.hash,          // first read counts as already seen
        cands: a.cands,
        opens: a.opens,
        checked: Date.now(),
      };
    } catch (e) {}
  }));
  writeJSON(WATCH_FILE, store);
  return store;
}

function markSeen(watch, urls) {
  for (const u of [].concat(urls || [])) if (watch[u]) watch[u].seen = watch[u].hash;
  writeJSON(WATCH_FILE, watch);
}


// ================= LIVE FEEDS =================

function decode(s) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try { return String.fromCodePoint(code); } catch (err) { return m; }
    }
    const v = named[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}
function clean(s) {
  if (!s) return "";
  const noCdata = s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  return decode(decode(noCdata.replace(/<[^>]+>/g, ""))).replace(/\s+/g, " ").trim();
}
function pick(block, re) {
  const m = block.match(re);
  return m ? m[1] : "";
}

// finn.no has no RSS, so the search results page itself is read
function parseFinn(html) {
  const out = [];
  const seen = new Set();
  const re = /<a[^>]+href="(https:\/\/www\.finn\.no\/job\/ad\/\d+)[^"]*"[^>]*>([\s\S]{0,400}?)<\/a>/g;
  let m;
  while ((m = re.exec(html)) && out.length < 60) {
    const url = m[1];
    if (seen.has(url)) continue;
    const role = clean(m[2]);
    if (!role || role.length < 4) continue;
    seen.add(url);
    // the company name follows the title in the result card
    const after = html.slice(re.lastIndex, re.lastIndex + 900)
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .split(/<[^>]+>/).map((x) => clean(x)).filter((x) => x.length > 1);
    const company = after[0] && after[0].length < 70 ? after[0] : "finn.no";
    const context = role + " " + after.slice(0, 3).join(" ");
    if (!ENTRY_LEVEL.test(context) || !SHIPPING_WORDS.test(context)) continue;
    out.push({ company, role, url, time: 0, source: "finn", tier: tierOf(context) });
  }
  return out;
}

function parseFeed(xml, feed) {
  if (feed.kind === "finn") return parseFinn(xml);
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  const out = [];
  for (const b of blocks.slice(0, 40)) {
    const rawTitle = clean(pick(b, /<title[^>]*>([\s\S]*?)<\/title>/i));
    const link = clean(pick(b, /<link>([\s\S]*?)<\/link>/i));
    const time = Date.parse(clean(pick(b, /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)));
    if (!rawTitle || !/^https?:\/\//.test(link)) continue;

    let role = rawTitle;
    let company = feed.name;
    // Jobindex titles look like "Role, Company"; Google News titles like "Headline - Publisher"
    const sep = feed.kind === "jobindex" ? ", " : " - ";
    const i = rawTitle.lastIndexOf(sep);
    if (i > 5) { role = rawTitle.slice(0, i).trim(); company = rawTitle.slice(i + sep.length).trim(); }

    if (feed.kind === "jobindex" && !ENTRY_LEVEL.test(role)) continue;
    if (feed.kind === "jobindex" && !SHIPPING_WORDS.test(rawTitle)) continue;
    out.push({ company, role, tier: tierOf(rawTitle), url: link, time: isNaN(time) ? 0 : time, source: feed.kind === "news" ? "News" : "Jobindex" });
  }
  return out;
}

async function fetchFeed(feed) {
  try {
    const req = new Request(feed.url);
    req.timeoutInterval = 8;
    req.headers = { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" };
    return parseFeed(await req.loadString(), feed);
  } catch (e) {
    return [];
  }
}

async function getLive(maxAgeHours) {
  const cache = readJSON(CACHE, null);
  if (cache && Date.now() - cache.fetched < maxAgeHours * 3600000) return cache;

  const lists = await Promise.all(LIVE_FEEDS.map(fetchFeed));
  const firstSeen = {};
  if (cache && cache.items) for (const it of cache.items) firstSeen[it.url] = it.time;
  for (const it of lists.flat()) if (!it.time) it.time = firstSeen[it.url] || Date.now();
  const cutoff = Date.now() - LIVE_MAX_AGE_DAYS * 86400000;
  const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const trackedUrls = new Set(TRACKED.map((t) => t.url));
  const isTracked = (it) => trackedUrls.has(it.url) ||
    TRACKED.some((t) => norm(it.role) === norm(t.role) && norm(it.company).startsWith(norm(t.company)));
  const seen = new Set();
  const items = [];
  for (const it of lists.flat()) {
    if (it.time && it.time < cutoff) continue;
    if (isTracked(it)) continue;
    const key = (it.company + it.role).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 70);
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(it);
  }
  items.sort((a, b) => (a.source === "News" ? 1 : 0) - (b.source === "News" ? 1 : 0) || (a.tier || 4) - (b.tier || 4) || b.time - a.time);

  if (!items.length && cache) return cache; // keep last good data if every feed failed
  const data = { fetched: Date.now(), items: items.slice(0, 40) };
  writeJSON(CACHE, data);
  return data;
}

// ================= WIDGET HELPERS =================

function runURL(section) {
  return "scriptable:///run/" + encodeURIComponent(Script.name()) + (section ? "?section=" + section : "");
}

function background(w) {
  const g = new LinearGradient();
  g.colors = [C.bgTop, C.bgBottom];
  g.locations = [0, 1];
  w.backgroundGradient = g;
}

function addHeader(w, label, color, right) {
  const head = w.addStack();
  head.layoutHorizontally();
  head.centerAlignContent();
  head.url = runURL();
  const t = head.addText(label);
  t.font = Font.heavySystemFont(10);
  t.textColor = color;
  head.addSpacer();
  if (right) {
    const r = head.addText(right);
    r.font = Font.mediumSystemFont(9);
    r.textColor = C.dim;
  }
}

// One row: [date] Company  Role ......... [chip]
function addRow(parent, e, fontSize, dateWidth) {
  const row = parent.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  if (e.url) row.url = e.url;

  const dcol = row.addStack();
  dcol.size = new Size(dateWidth, 0);
  const d = dcol.addText(e.dateLabel);
  d.font = Font.mediumMonospacedSystemFont(fontSize - 2);
  d.textColor = e.color;
  dcol.addSpacer();

  const c = row.addText(e.company);
  c.font = Font.semiboldSystemFont(fontSize);
  const tier = e.tier || (e.broker === false ? 3 : 2);
  c.textColor = tier === 1 ? C.gold : tier === 2 ? C.text : tier === 3 ? C.grey : C.dim;
  c.lineLimit = 1;

  row.addSpacer(5);
  const r = row.addText(e.role);
  r.font = Font.systemFont(fontSize);
  r.textColor = C.dim;
  r.lineLimit = 1;

  row.addSpacer();
  if (e.chip) {
    row.addSpacer(4);
    const ch = row.addText(e.chip);
    ch.font = Font.boldMonospacedSystemFont(fontSize - 2);
    ch.textColor = e.color;
  }
}

function liveRow(it) {
  return {
    company: it.company,
    role: it.role,
    url: it.url,
    dateLabel: it.source === "News" ? "News" : "New",
    chip: ago(it.time),
    color: it.source === "News" ? C.grey : C.blue,
    tier: it.tier || 4,
  };
}

function largeBudget() {
  if (SIZE_OVERRIDE && SIZE_OVERRIDE.large) return SIZE_OVERRIDE.large;
  const h = Device.screenSize().height;
  if (h >= 900) return 16;   // Plus / Pro Max
  if (h >= 840) return 14;   // standard and Pro
  if (h >= 800) return 13;   // mini
  return 12;                 // SE
}

// ================= WIDGETS =================

function buildNext(tr, live) {
  // Medium: the few things that need action
  const w = new ListWidget();
  background(w);
  w.setPadding(11, 13, 10, 13);
  w.url = runURL();
  w.refreshAfterDate = new Date(Date.now() + REFRESH_MINUTES * 60000);

  const urgent = tr.act.filter((e) => e.state === "open").length;
  addHeader(w, "APPLY NEXT", urgent ? C.red : C.blue, urgent ? urgent + " deadline" + (urgent > 1 ? "s" : "") + " open" : "no hard deadlines");
  w.addSpacer(6);

  const list = w.addStack();
  list.layoutVertically();
  list.spacing = 4;

  const rows = tr.act.slice(0, 3);
  if (rows.length < 3) rows.push(...tr.soon.slice(0, 3 - rows.length));
  if (!rows.length) {
    const t = list.addText("Nothing to act on right now.");
    t.font = Font.italicSystemFont(11);
    t.textColor = C.dim;
  }
  for (const e of rows) addRow(list, e, 12, 50);

  w.addSpacer();
  const foot = w.addStack();
  foot.layoutHorizontally();
  const next = tr.soon.find((e) => !rows.includes(e));
  const parts = [];
  if (next) parts.push("Next to open: " + next.company + " " + next.dateLabel);
  const fresh = live.items.filter((i) => i.source !== "News" && Date.now() - i.time < 7 * 86400000).length;
  if (fresh) parts.push(fresh + " new posting" + (fresh > 1 ? "s" : "") + " this week");
  const f = foot.addText(parts.join("  \u00B7  ") || "Updated " + clock(Date.now()));
  f.font = Font.mediumSystemFont(9);
  f.textColor = C.dim;
  f.lineLimit = 1;
  return w;
}

function buildTrackerWidget(tr, live) {
  // Large: open now, opening soon, new postings
  const w = new ListWidget();
  background(w);
  w.setPadding(12, 13, 11, 13);
  w.url = runURL();
  w.refreshAfterDate = new Date(Date.now() + REFRESH_MINUTES * 60000);

  const fs = 11.5;
  let budget = largeBudget();
  const liveItems = live.items.slice(0, 4).map(liveRow);
  const liveRows = Math.min(liveItems.length, 3);
  budget -= liveRows ? liveRows + 1 : 0; // +1 for its header

  const actRows = tr.act.slice(0, Math.max(3, budget - 1 - Math.min(tr.soon.length, 4)));
  budget -= actRows.length;
  const soonRows = tr.soon.slice(0, Math.max(0, budget - 1));

  addHeader(w, "OPEN NOW", C.green, "deadline \u00B7 days left");
  w.addSpacer(4);
  const a = w.addStack();
  a.layoutVertically();
  a.spacing = 3;
  if (!actRows.length) {
    const t = a.addText("Nothing open right now.");
    t.font = Font.italicSystemFont(fs);
    t.textColor = C.dim;
  }
  for (const e of actRows) addRow(a, e, fs, 46);

  if (soonRows.length) {
    divider(w);
    addHeader(w, "OPENING SOON", C.grey, "usual opening \u00B7 est.");
    w.addSpacer(4);
    const s = w.addStack();
    s.layoutVertically();
    s.spacing = 3;
    for (const e of soonRows) addRow(s, e, fs, 46);
  }

  if (liveRows) {
    divider(w);
    addHeader(w, "NEW POSTINGS", C.blue, "updated " + clock(live.fetched));
    w.addSpacer(4);
    const l = w.addStack();
    l.layoutVertically();
    l.spacing = 3;
    for (const e of liveItems.slice(0, liveRows)) addRow(l, e, fs, 46);
  }

  w.addSpacer();
  return w;
}

function divider(w) {
  w.addSpacer(5);
  const d = w.addStack();
  d.size = new Size(0, 1);
  d.backgroundColor = C.line;
  d.addSpacer();
  w.addSpacer(5);
}

function buildLock(tr, family) {
  const w = new ListWidget();
  w.url = runURL();
  w.refreshAfterDate = new Date(Date.now() + REFRESH_MINUTES * 60000);
  const e = tr.act.find((x) => x.state === "open") || tr.act[0] || tr.soon[0];
  if (family === "accessoryInline") {
    w.addText(e ? e.company + " " + (e.state === "open" ? e.chip + " left" : e.dateLabel) : "No deadlines");
    return w;
  }
  const h = w.addText(e && e.state === "open" ? "NEXT DEADLINE" : "SHIPPING JOBS");
  h.font = Font.heavySystemFont(10);
  if (e) {
    const a = w.addText(e.company + "  " + (e.state === "open" ? e.chip + " left" : e.dateLabel));
    a.font = Font.semiboldSystemFont(13);
    a.lineLimit = 1;
    const b = w.addText(e.role);
    b.font = Font.systemFont(11);
    b.lineLimit = 1;
  }
  return w;
}

// ================= FULL LIST (opens in Scriptable) =================

async function showList(state, live, watch) {
  const table = new UITable();
  table.showSeparators = true;

  const render = () => {
    table.removeAllRows();
    const tr = buildTracker(state, watch);

    const top = new UITableRow();
    top.height = 50;
    const tc = top.addText("Shipping Deadlines", "Programmes verified " + VERIFIED + "  \u00B7  live postings " + clock(live.fetched) + "  \u00B7  careers pages checked every " + WATCH_HOURS + "h  \u00B7  tap a row for options");
    tc.titleFont = Font.heavySystemFont(20);
    tc.subtitleFont = Font.systemFont(11);
    tc.subtitleColor = Color.gray();
    table.addRow(top);

    section("OPEN NOW", C.green, tr.act);
    section("OPENING SOON", C.grey, tr.soon);
    section("NEW POSTINGS", C.blue, live.items.map((i) => Object.assign(liveRow(i), { live: true, note: i.source + (i.time ? ", seen " + ago(i.time) : "") })));
    section("APPLIED", C.green, tr.applied);
    table.reload();
  };

  const section = (label, color, items) => {
    if (!items.length) return;
    const h = new UITableRow();
    h.isHeader = true;
    h.height = 40;
    const hc = h.addText(label + "  (" + items.length + ")");
    hc.titleFont = Font.heavySystemFont(15);
    hc.titleColor = color;
    table.addRow(h);

    for (const e of items) {
      const r = new UITableRow();
      r.height = e.note ? 92 : 64;
      r.dismissOnSelect = false;
      const when = describe(e);
      const sub = [TIER_NAMES[e.tier] || "", when, e.start ? "Start: " + e.start : "", e.place, e.note].filter(Boolean).join("  \u00B7  ");
      const c = r.addText((e.applied ? "\u2713 " : "") + e.company + "  \u00B7  " + e.role, sub);
      c.titleFont = Font.semiboldSystemFont(15);
      c.subtitleFont = Font.systemFont(12);
      c.subtitleColor = Color.gray();
      r.onSelect = () => { rowMenu(e).then((changed) => { if (changed) render(); }); };
      table.addRow(r);
    }
  };

  const rowMenu = async (e) => {
    const a = new Alert();
    a.title = e.company;
    a.message = e.role;
    a.addAction("Open posting");
    if (!e.live) a.addAction(e.applied ? "Unmark applied" : "Mark as applied");
    a.addCancelAction("Cancel");
    const i = await a.presentSheet();
    if (i === 0 && e.url) {
      const wasChanged = e.changed;
      markSeen(watch, e.watch);
      Safari.openInApp(e.url, false);
      return !!wasChanged;
    }
    if (i === 1 && !e.live) {
      state.applied = state.applied || {};
      const k = itemKey(e);
      if (state.applied[k]) delete state.applied[k]; else state.applied[k] = Date.now();
      writeJSON(STATE, state);
      return true;
    }
    return false;
  };

  render();
  await table.present(false);
}

const TIER_NAMES = { 1: "Clarksons", 2: "Shipbroker", 3: "Chartering desk", 4: "Other shipping" };

function describe(e) {
  if (e.live) return "";
  const flag = e.changed ? "Their page changed since you last opened it. " : "";
  if (e.state === "open") return flag + "Deadline " + e.dateLabel + " (" + (e.days === 0 ? "today" : e.days + " days left") + ")" + (e.auto ? ", read from their page" : "");
  if (e.state === "check" && e.status === "nowopen") return flag + "Their page says applications are open";
  if (e.state === "rolling") return flag + "No deadline, apply any time";
  if (e.state === "check") return flag + "Usually open by now, check the page" + (e.deadline ? ". Deadline around " + fmtDay(parseDay(e.deadline)) : "");
  if (e.state === "soon") {
    const op = parseDay(e.opens);
    const opening = op ? "Usually opens " + (e.est ? "around " : "") + fmtDay(op) : "Opening date not announced yet";
    return opening + (e.deadline ? ", deadline around " + fmtDay(parseDay(e.deadline)) : "");
  }
  if (e.state === "missed") return "Closed " + e.dateLabel;
  return "";
}

// ================= RUN =================

const state = readJSON(STATE, { applied: {} });
await loadRemote(config.runsInWidget ? REMOTE_HOURS : 1);

if (config.runsInWidget) {
  const family = config.widgetFamily || "large";
  const param = (args.widgetParameter || "").trim().toLowerCase();
  let w;
  if (family.startsWith("accessory")) {
    w = buildLock(buildTracker(state, readJSON(WATCH_FILE, {})), family);
  } else {
    const [live, watch] = await Promise.all([getLive(CACHE_HOURS), getWatch(WATCH_HOURS)]);
    const tr = buildTracker(state, watch);
    const view = param || (family === "large" || family === "extraLarge" ? "tracker" : "next");
    w = view === "tracker" ? buildTrackerWidget(tr, live) : buildNext(tr, live);
  }
  Script.setWidget(w);
} else {
  const [live, watch] = await Promise.all([getLive(0.5), getWatch(1)]);
  await showList(state, live, watch);
}
Script.complete();
