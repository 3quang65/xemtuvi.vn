// Minh — L-33217b: đo dải chữ mẫu 65–75% (theo BÀI, không chỉ TB) + phân rã câu + ngân sách chữ cần thêm.
// Dùng: node do-dai-chu-mau.cjs --root <cây xemtuvi.vn> [--n 10] [--json <tệp>]
// Cần node_modules có `typescript` (đặt NODE_MODULES=... nếu cây không có).
const fs=require('node:fs'), path=require('node:path');
const argv=process.argv.slice(2), lay=(k,d)=>{const i=argv.indexOf('--'+k);return i>=0?argv[i+1]:d;};
const ROOT=path.resolve(lay('root','/tmp/xemtuvi-lam')), NM=process.env.NODE_MODULES||path.join(ROOT,'node_modules');
const ts=require(path.join(NM,'typescript'));
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,f);
const AIP=path.join(ROOT,'src/lib/luan-giai/ai'); process.chdir(ROOT);
const {lapLaSo}=require(path.join(ROOT,'src/lib/tuvi/index.ts'));
const AI=require(path.join(AIP,'index.ts'));
const {taoChiMuc,tachTu,NGUONG,baiThanhVanBan}=require(path.join(ROOT,'tools/lib/chu-mau.cjs'));
const KHO=['quy-tac.json','quy-tac-khung.json','quy-tac-van/van-nam-2027.json','quy-tac-van/van-10-nam.json','quy-tac-van/van-10-nam-pp.json','quy-tac-van/van-10-nam-sp.json'].map(f=>path.join(AIP,f)).filter(fs.existsSync);
const noiDung=KHO.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).map(q=>q.noiDung).filter(Boolean));
const cm=taoChiMuc(noiDung);
const TC=require(path.join(ROOT,'docs/nghien-cuu/tuvi-test-cases.json')).cases;
const CD=['menh','quan-loc','phu-the','tai-bach','dien-trach','van-10-nam'];
const n=Number(lay('n','10')), S=65, T=75, THEM_KHOI=120; // 3 khối mở bài+câu nối+lời khuyên ≈120 từ
const r1=a=>Math.round(a*10)/10, tb=a=>a.length?r1(a.reduce((x,y)=>x+y,0)/a.length):0;
const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.max(0,Math.round(p/100*(s.length-1))))];};
const wcOf=(t)=>{const tu=tachTu(t);const phu=new Uint8Array(tu.length);
 for(let i=0;i+NGUONG<=tu.length;i++) if(cm.has(tu.slice(i,i+NGUONG).join(' '))) phu.fill(1,i,i+NGUONG);
 let d=0;for(const x of phu)d+=x;return {W:tu.length,mau:d,tu,phu};};
(async()=>{
 const KQ={kho:{tep:KHO.length,noiDung:noiDung.length},n,chuyenDe:{}};
 for(const cd of CD){
  const R=[]; const cau={nguyen:0,lai:0,tv:0,soCau:0,cauTV:new Map()};
  for(let i=0;i<n;i++){
   const tc=TC[i%TC.length]; const ls=lapLaSo(tc.input); let b;
   try{ b=await AI.sinhLuanGiai(ls,cd,{boQuaCache:true,namXem:2027,tongHop:cd!=='van-10-nam'}); }catch(e){ R.push({ca:tc.id,loi:e.message}); continue; }
   const t=baiThanhVanBan(b); const {W,mau,tu}=wcOf(t);
   const r=W?100*mau/W:0;
   const tv=W-mau;
   R.push({ca:tc.id,W,mau,tv,r:r1(r),dat:r>=S&&r<=T,
     canThem65:r<S?Math.ceil(S/100*W)-mau:0, canBot75:r>T?mau-Math.floor(T/100*W):0,
     rNeuThemKhoi:W?r1(100*mau/(W+THEM_KHOI)):0,
     mauCanThemNeuKhoi:Math.max(0,Math.ceil(S/100*(W+THEM_KHOI))-mau)});
   // mức câu
   const daCo=new Set();
   for(const cauTxt of t.split(/(?<=[.!?])\s+/)){
    const c=tachTu(cauTxt); if(c.length<8) continue; cau.soCau++;
    let d=0; const p=new Uint8Array(c.length);
    for(let k=0;k+NGUONG<=c.length;k++) if(cm.has(c.slice(k,k+NGUONG).join(' '))) p.fill(1,k,k+NGUONG);
    for(const x of p)d+=x; const rr=d/c.length;
    const loai=rr>=0.95?'nguyen':rr>=0.5?'lai':'tv'; cau[loai]++;
    if(loai==='tv'){const key=cauTxt.trim(); if(!daCo.has(key)){daCo.add(key); cau.cauTV.set(key,(cau.cauTV.get(key)||0)+1);} else cau.cauTV.set(key,cau.cauTV.get(key)+1);}
   }
  }
  const khongRong=R.filter(x=>!x.loi);
  const ok=khongRong.filter(x=>x.W>0); const rong=khongRong.length-ok.length;
  const rs=ok.map(x=>x.r);
  const lap=[...cau.cauTV.values()].filter(v=>v>=2).reduce((a,v)=>a+v,0);
  KQ.chuyenDe[cd]={bai:ok.length,baiRong:rong,loi:R.length-ok.length,
    W:tb(ok.map(x=>x.W)), mau:tb(ok.map(x=>x.mau)), tv:tb(ok.map(x=>x.tv)),
    r:tb(rs), min:Math.min(...rs), max:Math.max(...rs), p10:pct(rs,10), p90:pct(rs,90),
    dat:ok.filter(x=>x.dat).length, duoi:ok.filter(x=>x.r<S).length, tren:ok.filter(x=>x.r>T).length,
    thieu:tb(ok.filter(x=>x.r<S).map(x=>x.canThem65)), thua:tb(ok.filter(x=>x.r>T).map(x=>x.canBot75)),
    rNeuThemKhoi:tb(ok.map(x=>x.rNeuThemKhoi)), mauCanThemNeuKhoi:tb(ok.map(x=>x.mauCanThemNeuKhoi)),
    cau:{nguyen:r1(cau.nguyen/Math.max(ok.length,1)),lai:r1(cau.lai/Math.max(ok.length,1)),tv:r1(cau.tv/Math.max(ok.length,1)),soCau:r1(cau.soCau/Math.max(ok.length,1)),tvLap:lap, tvTong:cau.tv},
    chiTiet:ok};
 }
 const d=KQ.chuyenDe;
 const L=['# L-33217b — Dải chữ mẫu 65–75% đo theo TỪNG BÀI (Minh, 05/11/2026)','',
  `Cây đo: \`${ROOT}\` · kho ${KQ.kho.tep} tệp / ${KQ.kho.noiDung} noiDung · ${n} lá số/chuyên đề (TC01–TC11 xoay vòng) · bật \`tongHop\` cho 5 chuyên đề thường (mô phỏng sau khi gộp nhánh Tùng).`,'',
  '## A. Tỷ lệ chữ mẫu và số bài ĐẠT dải','',
  '| Chuyên đề | Bài | TB | p10–p90 | min–max | Đạt 65–75% | <65% | >75% |','|---|---|---|---|---|---|---|---|'];
 for(const cd of CD){const x=d[cd];L.push(`| ${cd} | ${x.bai}/${n}${x.baiRong?' ('+x.baiRong+' rỗng)':''} | ${x.r}% | ${x.p10}–${x.p90}% | ${x.min}–${x.max}% | **${x.dat}/${x.bai}** | ${x.duoi} | ${x.tren} |`);}
 L.push('','## B. Chữ tự viết (ngoài mẫu) và ngân sách','',
  '| Chuyên đề | Từ/bài | Từ mẫu | Từ tự viết | Nên có để 65–75% | Thiếu từ mẫu (bài <65%) | Thừa từ mẫu (bài >75%) |','|---|---|---|---|---|---|---|');
 for(const cd of CD){const x=d[cd];const lo=Math.round(0.333*x.mau),hi=Math.round(0.538*x.mau);L.push(`| ${cd} | ${x.W} | ${x.mau} | ${x.tv} | ${lo}–${hi} | ${x.thieu||'—'} | ${x.thua||'—'} |`);}
 L.push('','## C. Nếu thêm 3 khối viết tay (mở bài + câu nối + lời khuyên, ≈'+THEM_KHOI+' từ/bài)','',
  '| Chuyên đề | Tỷ lệ hiện | Sau khi thêm 3 khối | Chữ mẫu cần thêm/bài để vẫn ≥65% |','|---|---|---|---|');
 for(const cd of CD){const x=d[cd];L.push(`| ${cd} | ${x.r}% | ${x.rNeuThemKhoi}% | ${x.mauCanThemNeuKhoi} |`);}
 L.push('','## D. Mức câu: nguyên văn / lai / tự viết','',
  '| Chuyên đề | Câu ≥8 từ/bài | Nguyên văn (≥95% trùng mẫu) | Lai (50–95%) | Tự viết (<50%) | Câu tự viết LẶP nguyên văn giữa các lá số |','|---|---|---|---|---|---|');
 for(const cd of CD){const x=d[cd];L.push(`| ${cd} | ${x.cau.soCau} | ${x.cau.nguyen} | ${x.cau.lai} | ${x.cau.tv} | ${x.cau.tvLap}/${x.cau.tvTong} |`);}
 L.push('','- Định nghĩa chữ mẫu: chuỗi ≥8 từ liên tiếp trùng `noiDung` một quy tắc, chồng lấn tính 1 lần (spec mục 4 B1).',
  '- p10–p90 = phân vị 10–90 của tỷ lệ từng bài: cho thấy độ phân tán; TB nằm trong dải không có nghĩa là bài nào cũng đạt.',
  '- "Câu tự viết LẶP" = câu có <50% từ trùng mẫu nhưng xuất hiện NGUYÊN VĂN ở ≥2 lá số ⇒ là khuôn/kết quả tổ hợp, không phải văn viết tay.',
  '- Bài rỗng (chưa tới tuổi đại vận sinh 0 từ) bị loại khỏi mọi thống kê tỷ lệ, có ghi ở cột Bài.',
  '- Chạy lại: `node do-dai-chu-mau.cjs --root <cây> --n 10`.');
 console.log(L.join('\n'));
 const jf=lay('json',''); if(jf) fs.writeFileSync(jf,JSON.stringify(KQ,null,1));
})();
