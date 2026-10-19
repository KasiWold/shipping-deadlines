# shipping-deadlines

Master list behind the Shipping Deadlines iPhone widget (Scriptable).

- `opportunities.json` holds every tracked shipping opportunity from January 2027 onward, ranked by tier (1 Clarksons, 2 shipbroker, 3 chartering desk, 4 other shipping). It covers every country; roles that need a work visa are marked with a "visa" field, never left out. Live postings already checked and found unsuitable go in the "ignore" list. A scheduled Claude research run updates it every Monday, Wednesday and Friday morning.
- `Shipping Deadlines.js` is the current widget script. The widget downloads `opportunities.json` from this repository by itself, so the script only needs replacing when the widget itself changes.
