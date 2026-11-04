// Minh — L-33217b: đếm quy tắc Tài Bạch / Điền Trạch / cặp cung hợp chiếu trên một cây xemtuvi.
// Dùng: node dem-quy-tac.cjs --root <cây>
const fs=require('node:fs'), path=require('node:path');
const argv=process.argv.slice(2), lay=(k,d)=>{const i=argv.indexOf('--'+k);return i>=0?argv[i+1]:d;};
const ROOT=path.resolve(lay('root','/tmp/xemtuvi-lam')); const AIP=path.join(ROOT,'src/lib/luan-giai/ai');
const doc=(f)=>{try{return JSON.parse(fs.readFileSync(path.join(AIP,f),'utf8'))}catch(e){return null}};
const ban1=doc('quy-tac.json')||[], khung=doc('quy-tac-khung.json')||[];
const v2=[]; const d2=path.join(AIP,'quy-tac-v2');
if(fs.existsSync(d2)) for(const f of fs.readdirSync(d2).filter(f=>f.endsWith('.json'))) v2.push(...JSON.parse(fs.readFileSync(path.join(d2,f),'utf8')));
const van=['van-10-nam','van-10-nam-pp','van-10-nam-sp','van-nam-2027'].flatMap(f=>doc('quy-tac-van/'+f)||[]);
const tatCa=[...ban1,...khung,...v2,...van];
const cd=(q)=>q.chuyenDe||q.chuyen_de||'';
const cung=(q)=>q.cung||{};
const muc=(q)=>q.muc||'';
const demCd=(ten)=>tatCa.filter(q=>{const c=cung(q);return (typeof c==='string'?c:c.ten)===ten}).length;
const out=[];
out.push('# Đếm quy tắc — '+ROOT);
out.push('Tệp: quy-tac.json '+ban1.length+' · quy-tac-khung.json '+khung.length+' · quy-tac-v2/ '+v2.length+' · quy-tac-van/ '+van.length+' ⇒ tổng '+tatCa.length);
out.push('');
out.push('| Chỉ tiêu | Hiện | Mục tiêu | Kết luận |');
out.push('|---|---|---|---|');
const tb=demCd('Tài Bạch'), dt=demCd('Điền Trạch');
out.push(`| Quy tắc cung Tài Bạch | ${tb} | ≥100 | ${tb>=100?'ĐẠT':'CHƯA'} |`);
out.push(`| Quy tắc cung Điền Trạch | ${dt} | ≥60 | ${dt>=60?'ĐẠT':'CHƯA'} |`);
// hợp chiếu: cặp (chuyên đề → cung liên quan) trên các quy tắc muc cung-lien-quan
const CDS=['menh','quan-loc','phu-the','tai-bach','dien-trach'];
const cap=new Map();
for(const q of tatCa){ if(muc(q)!=='cung-lien-quan') continue; const c=cung(q); const ten=typeof c==='string'?c:c.ten;
  const k=cd(q)+' → '+ten; cap.set(k,(cap.get(k)||0)+1); }
const duoi=[...cap.entries()].filter(([,n])=>n<25).sort((a,b)=>a[1]-b[1]);
out.push(`| Cặp cung hợp chiếu <25 câu | ${duoi.length}/${cap.size} | 0 | ${duoi.length?'CHƯA':'ĐẠT'} |`);
out.push(`| Số câu muc cung-lien-quan | ${tatCa.filter(q=>muc(q)==='cung-lien-quan').length} | — | — |`);
out.push('','## Cặp dưới 25 câu','| Cặp | Số câu |','|---|---|');
for(const [k,n] of duoi) out.push(`| ${k} | ${n} |`);
out.push('','## Điền Trạch theo muc','| Mục | Số câu |','|---|---|');
const md={}; for(const q of tatCa){const c=cung(q);if((typeof c==='string'?c:c.ten)==='Điền Trạch')md[muc(q)||'(trống)']=(md[muc(q)||'(trống)']||0)+1;}
for(const [k,n] of Object.entries(md).sort((a,b)=>b[1]-a[1])) out.push(`| ${k} | ${n} |`);
console.log(out.join('\n'));
