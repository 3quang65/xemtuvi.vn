process.chdir('/home/claude/xemtuvi.vn');
const fs=require('fs'),ts=require('/home/claude/xemtuvi.vn/node_modules/typescript');
require.extensions['.ts']=(m,f)=>{m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,f);};
const {lapLaSo}=require('/home/claude/xemtuvi.vn/src/lib/tuvi/index.ts');
const VN=require('/home/claude/xemtuvi.vn/src/lib/luan-giai/ai/van-nam.ts');
const AI=require('/home/claude/xemtuvi.vn/src/lib/luan-giai/ai/index.ts');
const BS='Khi có dấu hiệu bất thường về sức khỏe, bạn nên hỏi ý kiến bác sĩ.';
(async()=>{let max=0,tong=0,n=0,dist={};const vanMax={};let invMax={};
for(let y=1975;y<=2004;y++)for(const m of [1,4,7,10])for(const g of [0,6,12,18]){
 const ls=lapLaSo({lich:'duong',ngay:12,thang:m,nam:y,gio:g,phut:0,gioiTinh:(y%2?'nam':'nu')});
 let bai;try{bai=await VN.sinhVanNam(ls,{boQuaCache:true});}catch(e){continue;}
 const s=JSON.stringify(bai);const c=s.split(BS).length-1;dist[c]=(dist[c]||0)+1;n++;
 if(c>max){max=c;vanMax.ex={y,m,g};}
 if(n<=40) for(const cd of ['menh','phu-the','quan-loc','van-10-nam']){try{const r=await AI.sinhLuanGiai(ls,cd,{boQuaCache:true});const t=JSON.stringify(r);const k=(t.match(/Bạn thử (đối chiếu|nhìn lại)/g)||[]).length;invMax[cd]=Math.max(invMax[cd]||0,k);const b=t.split(BS).length-1;invMax[cd+'-bs']=Math.max(invMax[cd+'-bs']||0,b);}catch(e){invMax[cd+'-err']=e.message}}
}
console.log('van-nam bai',n,'phan bo so cau bac si/bai',dist,'max',max,vanMax.ex);console.log('so cau moi/bac si max theo chuyen de',invMax);})();
