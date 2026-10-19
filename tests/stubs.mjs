// Minimal Scriptable stand-ins for running the widget script in Node
export function install(opts = {}) {
  const rec = []; let rows = [];
  class Stack { constructor(d=0){this.d=d;} layoutHorizontally(){} layoutVertically(){} centerAlignContent(){} addSpacer(){} addStack(){return new Stack(this.d+1);} addText(t){ if (typeof t !== "string") throw new Error("addText got " + typeof t); rec.push(t); return {}; } }
  globalThis.ListWidget = class extends Stack { setPadding(){} };
  globalThis.Color = class { constructor(c){this.c=c;} static gray(){return {};} };
  globalThis.Font = new Proxy({}, {get:()=>()=>({})});
  globalThis.Size = class {}; globalThis.LinearGradient = class {};
  globalThis.Device = { screenSize: () => ({height: 852}) };
  globalThis.Script = { name: () => 'Shipping Deadlines', setWidget(){}, complete(){} };
  const files = opts.files || {};
  globalThis.FileManager = { local: () => ({ joinPath:(a,b)=>a+'/'+b, cacheDirectory:()=>'/c', documentsDirectory:()=>'/d', fileExists:p=>p in files, readString:p=>files[p], writeString:(p,s)=>{files[p]=s;} }) };
  globalThis.Request = class { constructor(u){this.u=u; this.response={statusCode:200};}
    async loadString(){ const r = (opts.net||(()=>{throw new Error("offline")}))(this.u); if (r instanceof Error) throw r; return r; }
    async loadJSON(){ return JSON.parse(await this.loadString()); } };
  globalThis.UITableRow = class { addText(t,s){ rows.push(t + (s ? '  |  ' + s : '')); return {}; } };
  globalThis.UITable = class { addRow(){} removeAllRows(){ rows=[]; } reload(){} async present(){} };
  globalThis.Alert = class { addAction(){} addCancelAction(){} async presentSheet(){return -1;} };
  globalThis.Safari = { openInApp(){} };
  return { rec, rows: () => rows, files };
}
