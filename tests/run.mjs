import fs from 'fs';
import { install } from './stubs.mjs';
const SRC = fs.readFileSync(process.argv[2] || new URL("../Shipping Deadlines.js", import.meta.url), "utf8");
let fails = 0, passes = 0;
const ok = (c, msg) => { if (c) passes++; else { fails++; console.log("FAIL:", msg); } };

// Load the script's functions without running it: cut at RUN and export what we test
const lib = SRC.slice(0, SRC.indexOf("// ================= RUN =================")) +
  "\nreturn { ENTRY_LEVEL, SHIPPING_WORDS, tierOf, analyse, parseClarksons, parseFinn, parseFeed, evaluate, baseEvaluate, buildTracker, parseDay, SEEN, oldYear };";
function load(opts) { const env = install(opts); const L = (new Function(lib))(); return { env, L }; }
async function runScript(opts, cfg) { const env = install(opts); globalThis.config = cfg; globalThis.args = { widgetParameter: '' }; await (new Function('return (async () => {' + SRC + '})')())(); return env; }

const { L } = load();

// ---- 1. entry-level and shipping filters on real-looking job titles ----
const accept = [
  "Student Assistant - Market Research, MB Shipbrokers A/S",
  "Shipping Trainee, Hafnia",
  "Junior Tanker Broker, Uni-Tankers A/S",
  "Chartering Trainee, Ultrabulk A/S",
  "Summer Internship 2027 Chartering, Klaveness",
  "Studentermedhjælper til befragtning, Norden",
  "Trainee Shipbroker, Howe Robinson",
];
const reject = [
  "Business Development Manager, Maersk",        // "elev" inside development
  "International Sales Coordinator, Hafnia",      // "intern" inside international
  "Internal Auditor, TORM",                       // "intern" inside internal
  "Marine Superintendent, Odfjell Management",    // not entry level
  "Tanker Broker, UNI-TANKERS A/S",               // experienced
  "Ejendomsmægler trainee, home",                 // real-estate broker
  "Chartered Accountant Trainee, PwC",            // not shipping
  "Insurance Broker Trainee, Willis",             // insurance broker
  "Digital Marketing Trainee, Westpack A/S",      // not shipping
  "Customs Broker Graduate, DSV",                 // customs broker
];
for (const t of accept) { const role = t.split(", ")[0]; ok(L.ENTRY_LEVEL.test(role) && L.SHIPPING_WORDS.test(t), "should accept: " + t); }
for (const t of reject) { const role = t.split(", ")[0]; ok(!(L.ENTRY_LEVEL.test(role) && L.SHIPPING_WORDS.test(t)), "should reject: " + t); }
ok(L.tierOf("Student Assistant - Market Research, MB Shipbrokers A/S") === 2, "MB is tier 2");
ok(L.tierOf("Shipping Trainee, Hafnia") === 3, "Hafnia is tier 3");
ok(L.tierOf("Graduate, Clarksons") === 1, "Clarksons is tier 1");

// ---- 2. careers-page reading with real wording ----
const pad = "<p>" + "x ".repeat(300) + "</p>";
const gtbpReal = `<html><h1>Global Trainee Broker Programme</h1><p>Our flagship early careers programme is an incredible opportunity.</p><p>Applications for our 2026 intake are now closed</p><h2>Applications</h2><p>Visit our careers page today. <a href="x">Apply now</a></p>${pad}</html>`;
let a = L.analyse(gtbpReal);
ok(a.opens.length === 0, "closed 2026 intake + Apply now button must NOT read as open");
ok(a.cands.length === 0, "no deadline on the closed page");
a = L.analyse(`<html><p>Applications for our 2027 intake are now open.</p><p>Applications close on 14 February 2027.</p><p>Programme start date: 27 September 2027</p>${pad}</html>`);
ok(a.opens.length === 1, "2027 intake open is detected");
ok(a.cands.some((c) => c.d === "2027-02-14" && !c.weak), "deadline 14 Feb 2027 is read");
ok(!a.cands.some((c) => c.d === "2027-09-27" && !c.weak), "start date is not taken as deadline");
a = L.analyse(`<html><p>We are hiring! Apply now for our summer internship.</p>${pad}</html>`);
ok(a.opens.length === 0, "'Apply now' alone is not an announcement");
a = L.analyse(`<html><p>Applications for our 2026 programme are open</p>${pad}</html>`);
ok(a.opens.length === 0, "old-year 'open' sentence ignored");
a = L.analyse(`<html><p>Søknadsfrist: 07.11.2026</p><p>Commercial Trainee</p>${pad}</html>`);
ok(a.cands.some((c) => c.d === "2026-11-07"), "Norwegian deadline format read");


for (const [txt, want] of [
  ["Applications open in January 2027.", 0],
  ["Applications for the 2027 programme will open soon.", 0],
  ["Applications for the 2027 programme are not yet open.", 0],
  ["Applications are now closed.", 0],
  ["Applications are open until 31 January 2027.", 1],
  ["Applications are now open!", 1],
  ["We are now accepting applications for our trainee scheme.", 1],
]) { const r = L.analyse(`<html><p>${txt}</p>${pad}</html>`); ok(r.opens.length === want, "open reading for: " + txt + " (got " + r.opens.length + ")"); }

// ---- 3. Clarksons job board parser ----
const cl = `<table><tr class="data-row"><td><a href="/Clarksons/job/Houston-Trainee-Broker/1300000001/" class="jobTitle-link">Trainee Broker</a></td><td><span class="jobLocation">Houston, US</span></td><td>Oct 13, 2026</td></tr>
<tr class="data-row"><td><a href="/Clarksons/job/Hellerup-2027-Shipbroker-Intern-%28One-Year%29/1300000002/" class="jobTitle-link">2027 Shipbroker Intern (One Year Full Time Contract)</a></td><td><span class="jobLocation">Hellerup, DK</span></td></tr>
<tr class="data-row"><td><a href="/Clarksons/job/Oslo-2027-Trainee-Broker-Programme-%28Oslo%29-Early-Careers/1300000003/" class="jobTitle-link">2027 Trainee Broker Programme (Oslo) - Early Careers</a></td><td><span class="jobLocation">Oslo, NO</span></td></tr>
<tr class="data-row"><td><a href="/Clarksons/job/Athens-Accounts-Assistant/1300000004/" class="jobTitle-link">Accounts Assistant</a></td><td><span class="jobLocation">Athens, GR</span></td></tr>
<tr class="data-row"><td><a href="/Clarksons/job/Singapore-Trainee-Broker-%28LNG%29/1300000005/" class="jobTitle-link">Trainee Broker (LNG)</a></td><td><span class="jobLocation">Singapore, SG</span></td></tr>
<tr class="data-row"><td><a href="/Clarksons/job/London-Graduate-Analyst/1300000006/" class="jobTitle-link">Graduate Analyst</a></td><td><span class="jobLocation">London, GB</span></td></tr></table>`;
const pc = L.parseClarksons(cl);
ok(pc.length === 2, "Clarksons parser keeps exactly the 2 European entry-level roles (got " + pc.length + ": " + pc.map((x) => x.role).join(" / ") + ")");
ok(pc.every((x) => x.tier === 1 && x.url.startsWith("https://careers.clarksons.com/Clarksons/job/")), "Clarksons roles are tier 1 with full links");

// ---- 4. per-programme change detection ----
{
  const { L: L2 } = load({});
  const item = { id: "gtbp", company: "Clarksons", role: "GTBP", status: "expected", opens: "2026-12-01", est: true, url: "u", watch: "W", watchKey: "trainee broker programme|global trainee broker" };
  const page1 = L2.analyse(`<html><p>Trainee Broker Houston, US</p><p>Global Trainee Broker Programme 2026 intake closed</p>${pad}</html>`);
  let e = L2.evaluate(item, {}, { W: page1 });
  ok(!e.changed, "first read never flags a change");
  const page2 = L2.analyse(`<html><p>Trainee Broker Houston, US</p><p>Junior Analyst Tokyo, JP</p><p>Global Trainee Broker Programme 2026 intake closed</p>${pad}</html>`);
  e = L2.evaluate(item, {}, { W: page2 });
  ok(!e.changed, "unrelated new job on the same page does not flag this programme");
  const page3 = L2.analyse(`<html><p>Trainee Broker Houston, US</p><p>Global Trainee Broker Programme: applications for 2027 open soon</p>${pad}</html>`);
  e = L2.evaluate(item, {}, { W: page3 });
  ok(e.changed && e.chip === "updated", "a change to this programme's text is flagged");
}

// ---- 5. research beats page guesses; page guesses are amber "check" ----
{
  const { L: L3 } = load({});
  const confirmed = { id: "mb", company: "MB", role: "Student", status: "open", deadline: "2026-10-30", url: "u", watch: "W", anyDate: true };
  const page = L3.analyse(`<html><table><tr><td>Student Assistant IT</td><td>25-10-2026</td></tr></table>${pad}</html>`);
  const e = L3.evaluate(confirmed, {}, { W: page });
  ok(e.deadline === "2026-10-30" && !e.auto, "confirmed deadline is never replaced by a page reading");
  const exp = { id: "x", company: "X", role: "Trainee", status: "expected", opens: "2026-12-01", est: true, url: "u", watch: "W", watchKey: "\\btrainee\\b" };
  const pg = L3.analyse(`<html><p>Trainee programme: applications close 15 December 2026</p>${pad}</html>`);
  const e2 = L3.evaluate(exp, {}, { W: pg });
  ok(e2.state === "open" && e2.auto && e2.dateLabel === "15 Dec", "expected programme picks up a published deadline");
  const pg2 = L3.analyse(`<html><p>Applications for our 2027 trainee intake are now open</p>${pad}</html>`);
  const e3 = L3.evaluate(Object.assign({}, exp, { id: "y" }), {}, { W: pg2 });
  ok(e3.dateLabel === "Open?" && e3.chip === "check", "page 'open' reading shows as Open? / check, not a confirmed open");
}


// ---- 8. ordering: relevance first, but a deadline within a week jumps the queue ----
{
  const { L: L4 } = load({});
  const plus = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const save = [];
  const items = [
    { id: "a", company: "Broker", role: "Student", tier: 2, status: "open", deadline: plus(15), url: "u" },
    { id: "b", company: "Owner", role: "Intern", tier: 4, status: "open", deadline: plus(3), url: "u" },
    { id: "c", company: "Clarksons", role: "Trainee", tier: 1, status: "open", deadline: plus(40), url: "u" },
  ];
  const lib2 = SRC.slice(0, SRC.indexOf("// ================= RUN =================")) + "\nTRACKED = __items; return buildTracker({ applied: {} }, {});";
  install({});
  const tr = (new Function("__items", lib2))(items);
  ok(tr.act.map((e) => e.id).join(",") === "b,c,a", "order is: closing within a week, then Clarksons, then broker (got " + tr.act.map((e) => e.id).join(",") + ")");
}

// ---- 6. dates ----
ok(L.parseDay("2026-13-40") === null && L.parseDay("TBA") === null && L.parseDay(undefined) === null, "bad dates are rejected");
{
  const e = L.baseEvaluate({ company: "S", role: "T", status: "expected", opens: "2026-01-01", deadline: "2026-02-01", deadlineEst: true }, {});
  ok(e.dateLabel === "Check", "estimated deadline already passed shows Check, not an old date");
  const g = L.baseEvaluate({ company: "W", role: "S", status: "open", deadline: "2026-10-01" }, {});
  ok(g.state === "missed", "passed confirmed deadline drops off");
}

// ---- 7. whole widget: every size, offline, with good data, with broken data ----
const data = JSON.parse(fs.readFileSync(process.argv[3] || new URL("../opportunities.json", import.meta.url), "utf8"));
for (const fam of ["medium", "large", "accessoryRectangular", "accessoryInline"]) {
  try { const env = await runScript({ net: () => new Error("offline") }, { runsInWidget: true, widgetFamily: fam }); ok(env.rec.length > 0, "renders offline: " + fam); }
  catch (e) { ok(false, "crash offline " + fam + ": " + e.message); }
}
try {
  const env = await runScript({ net: () => new Error("offline") }, { runsInWidget: false });
  ok(env.rows().length > 5, "full list renders offline");
} catch (e) { ok(false, "crash in full list: " + e.message); }
const broken = JSON.stringify({ verified: "nonsense", items: [{ company: "A" }, null, { company: "B", role: "R", status: "open", deadline: "31/10/2026", url: "u" }, ...data.items.slice(0, 3)] });
for (const fam of ["medium", "large"]) {
  try { const env = await runScript({ net: (u) => u.includes("raw.githubusercontent") ? broken : new Error("offline") }, { runsInWidget: true, widgetFamily: fam }); ok(env.rec.length > 0, "survives malformed remote list: " + fam); }
  catch (e) { ok(false, "crash on malformed list " + fam + ": " + e.message); }
}
try {
  const env = await runScript({ net: (u) => u.includes("careers.clarksons.com") ? cl : u.includes("raw.githubusercontent") ? JSON.stringify(data) : new Error("offline") }, { runsInWidget: true, widgetFamily: "medium" });
  ok(env.rec.includes("NEW") && env.rec.some((t) => /Shipbroker Intern/.test(t)), "new Clarksons role appears at the top of the medium widget");
} catch (e) { ok(false, "crash with Clarksons feed: " + e.message); }

console.log(`\n${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
