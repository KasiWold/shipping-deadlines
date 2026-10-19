// Checks opportunities.json before it is published. Run: node validate.mjs
// Exits with code 1 and lists every problem if anything is wrong.
import fs from "fs";
const d = JSON.parse(fs.readFileSync(new URL("./opportunities.json", import.meta.url), "utf8"));
const problems = [];
const today = new Date(); today.setHours(0, 0, 0, 0);
const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + "T00:00:00"));
const day = (s) => new Date(s + "T00:00:00");
if (!isDate(d.verified)) problems.push("verified is not a YYYY-MM-DD date");
if (!Array.isArray(d.items) || !d.items.length) problems.push("items is empty");
const ids = new Set();
for (const it of d.items || []) {
  const name = (it && (it.id || it.company)) || "(unnamed)";
  const p = (m) => problems.push(name + ": " + m);
  if (!it || typeof it !== "object") { problems.push("an item is not an object"); continue; }
  for (const f of ["id", "company", "role", "place", "tier", "status", "url", "note"]) if (it[f] === undefined || it[f] === "") p("missing " + f);
  if (ids.has(it.id)) p("duplicate id"); ids.add(it.id);
  if (![1, 2, 3, 4].includes(it.tier)) p("tier must be 1, 2, 3 or 4");
  if (!["open", "rolling", "expected", "closed"].includes(it.status)) p("status must be open, rolling, expected or closed");
  for (const f of ["deadline", "opens"]) if (it[f] !== undefined && !isDate(it[f])) p(f + " is not a YYYY-MM-DD date");
  if (it.status === "open" && !it.deadline) p("open items need a deadline (use rolling if there is none)");
  if (it.status === "open" && isDate(it.deadline) && day(it.deadline) < today) p("deadline has passed; remove the item");
  if (it.status === "expected" && !it.opens && !it.note) p("expected items need an opens estimate or a note");
  if (typeof it.url !== "string" || !/^https:\/\//.test(it.url)) p("url must start with https://");
  for (const w of [].concat(it.watch || [])) if (!/^https:\/\//.test(w)) p("watch url must start with https://");
  if (it.watchKey !== undefined) { try { new RegExp(it.watchKey, "i"); } catch (e) { p("watchKey is not a valid regex"); } }
  if (it.watchKey && /(intern|elev|trainee|graduate|student)/i.test(it.watchKey) && !it.watchKey.includes("\\b")) p("watchKey uses a bare word; wrap it in \\b...\\b so it cannot match inside other words");
  if (/[—]/.test(it.note || "") || /[—]/.test(it.role || "")) p("contains an em dash");
  if (/london only|uk only|right to work in the uk/i.test(it.note || "") && !/oslo|copenhagen|hamburg|geneva|bergen|athens/i.test(it.place)) p("looks UK-only, which is out of scope");
}
if (problems.length) { console.log("PROBLEMS:\n- " + problems.join("\n- ")); process.exit(1); }
console.log("OK: " + d.items.length + " opportunities, verified " + d.verified);
