// Minh — L-33217b: bảng ĐÒN BẨY — mỗi đòn tác động bao nhiêu điểm % chữ mẫu và cần thêm bao nhiêu từ mẫu.
// Đòn 1: rút "Tóm lại" từ ~110 từ xuống 60 từ (mỗi câu ≤20 từ).
// Đòn 2: thêm 3 khối viết tay (mở bài, câu nối, lời khuyên) = +120 từ tự viết.
// Đòn 3: thêm câu quy tắc mẫu (≈20 từ/câu) cho tới khi ≥8/10 bài nằm trong 65–75%.
const fs=require('node:fs'), path=require('node:path');
const ROOT='/tmp/minh-L33217b/xemtuvi';
const ts=require('/tmp/xemtuvi-lam/node_modules/typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,f);
const AIP=path.join(ROOT,'src/lib/luan-giai/ai'); process.chdir(ROOT);
const {lapLaSo}=require(path.join(ROOT,'src/lib/tuvi/index.ts'));
const AI=require(path.join(AIP,'index.ts'));
const {taoChiMuc,tachTu,NGUONG,baiThanhVanBan}=require(path.join(ROOT,'tools/lib/chu-mau.cjs'));
const KHO=['quy-tac.json','quy-tac-khung.json','quy-tac-van/van-nam-2027.json','quy-tac-van/van-10-nam.json','quy-tac-van/van-10-nam-pp.json','quy-tac-van/van-10-nam-sp.json'].map(f=>path.join(AIP,f));
const cm=taoChiMuc(KHO.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).map(q=>q.noiDung).filter(Boolean)));
const TC=require(path.join(ROOT,'docs/nghien-cuu/tuvi-test-cases.json')).cases;
const CD=['menh','quan-loc','phu-the','tai-bach','dien-trach','van-10-nam'], n=10, S=65, T=75;
const r1=a=>Math.round(a*10)/10, tb=a=>a.length?r1(a.reduce((x,y)=>x+y,0)/a.length):0;
const doDai=t=>{const tu=tachTu(t);let d=0;const p=new Uint8Array(tu.length);
 for(let i=0;i+NGUONG<=tu.length;i++) if(cm.has(tu.slice(i,i+NGUONG).join(' '))) p.fill(1,i,i+NGUONG);
 for(const x of p)d+=x;return {W:tu.length,mau:d};};
const dat=(mau,W)=>{const r=100*mau/W;return r>=S&&r<=T;};
(async()=>{
 const KQ={};
 for(const cd of CD){
  const R=[];
  for(let i=0;i<n;i++){
   const ls=lapLaSo(TC[i%TC.length].input); let b;
   try{ b=await AI.sinhLuanGiai(ls,cd,{boQuaCache:true,namXem:2027,tongHop:cd!=='van-10-nam'}); }catch(e){continue;}
   const t=baiThanhVanBan(b); const {W,mau}=doDai(t);
   const tl=(b.muc||[]).find(m=>m.id==='tom-lai');
   const wTL=tl?(tl.nhanDinh||[]).map(z=>tachTu(z.text).length).reduce((a,c)=>a+c,0):0;
   const mauTL=tl?(tl.nhanDinh||[]).map(z=>{const s=doDai(z.text);return s.mau;}).reduce((a,c)=>a+c,0):0;
   // Đòn 1: Tóm lại còn 60 từ ⇒ bỏ (wTL-60) từ, trong đó phần mẫu giữ nguyên tỷ lệ
   const giamTL=Math.max(0,wTL-60), mauMat=Math.round(mauTL*giamTL/Math.max(wTL,1));
   const d1={W:W-giamTL, mau:mau-mauMat};
   // Đòn 1+2: thêm 120 từ tự viết
   const d12={W:d1.W+120, mau:d1.mau};
   // Đòn 1+2+3: thêm k câu quy tắc mẫu (20 từ/câu, toàn mẫu)
   const canK=(()=>{for(let k=0;k<=40;k++){ if(dat(d12.mau+20*k,d12.W+20*k)) return k; } return null;})();
   R.push({ca:TC[i%TC.length].id,W,mau,r:W?r1(100*mau/W):null,wTL,mauTL,
     r1:r1(100*d1.mau/Math.max(d1.W,1)), r12:r1(100*d12.mau/Math.max(d12.W,1)), k:canK});
  }
  KQ[cd]=R;
  const coR=R.filter(x=>x.r!=null), canK=R.filter(x=>x.k!==null&&x.k>0).map(x=>x.k);
  console.log(`\n=== ${cd}`);
  console.log(`  TB hiện ${tb(coR.map(x=>x.r))}% → rút Tóm lại ${tb(R.map(x=>x.r1))}% → +3 khối ${tb(R.map(x=>x.r12))}%`);
  console.log(`  bài đã đạt sau đòn1+2: ${R.filter(x=>x.r12>=S&&x.r12<=T).length}/${R.length}; cần thêm câu mẫu: TB ${canK.length?tb(canK):0} câu (0 = đã đạt)`);
  console.log('  chi tiết:', R.map(x=>`${x.ca}:${x.r}→${x.r1}→${x.r12}(k=${x.k})`).join(' '));
 }
 const L=['# Bảng đòn bẩy đưa bài về dải 65–75% (Minh, 05/11)','',
  '| Chuyên đề | TB hiện | Sau rút Tóm lại 60 từ | Sau +3 khối 120 từ | Đạt dải sau 2 đòn | Câu quy tắc cần thêm (20 từ/câu) |','|---|---|---|---|---|---|'];
 for(const cd of CD){const R=KQ[cd].filter(x=>x.r!=null);
  const canK=R.filter(x=>x.k!==null&&x.k>0).map(x=>x.k);
  L.push(`| ${cd} | ${tb(R.map(x=>x.r))}% | ${tb(R.map(x=>x.r1))}% | ${tb(R.map(x=>x.r12))}% | ${R.filter(x=>x.r12>=S&&x.r12<=T).length}/${R.length} | ${canK.length? 'TB '+tb(canK)+' (max '+Math.max(...canK)+')' : '0'} |`);}
 L.push('','- Đòn 1: "Tóm lại" hiện ~'+tb(Object.values(KQ).flat().filter(x=>x.wTL>0).map(x=>x.wTL))+' từ/bài, 71–77% là chữ tự viết ⇒ rút về 60 từ (3 câu × 20 từ) vừa đúng yêu cầu spec (2–3 câu).',
  '- Đòn 2: thêm 3 khối viết tay (mở bài + câu nối + lời khuyên) 120 từ/bài — đúng chỉ tiêu 4 khối 30%.',
  '- Đòn 3: số câu quy tắc mẫu (≈20 từ/câu) cần thêm để bài đó trở lại ≥65% sau 2 đòn đầu.',
  '- Đòn 1 KHÔNG tự làm giảm chất lượng: "Tóm lại" 2–3 câu là đúng spec; hiện 3 câu nhưng mỗi câu 35–37 từ.');
 console.log('\n'+L.join('\n'));
 fs.writeFileSync('/tmp/minh-L33217b/ra/don-bay.md',L.join('\n')+'\n');
 fs.writeFileSync('/tmp/minh-L33217b/ra/kq-don-bay.json',JSON.stringify(KQ,null,1));
})();
