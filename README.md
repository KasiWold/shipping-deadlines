# shipping-deadlines

Master list behind the Shipping Deadlines iPhone widget (Scriptable).

- `opportunities.json` holds every tracked shipping opportunity from January 2027 onward, ranked by tier (1 Clarksons, 2 shipbroker, 3 chartering desk, 4 other shipping). A scheduled Claude research run updates it every Monday and Thursday morning.
- `Shipping Deadlines.js` is the current widget script. The widget downloads `opportunities.json` from this repository by itself, so the script only needs replacing when the widget itself changes.
