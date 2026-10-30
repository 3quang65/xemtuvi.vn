const path=require('path');const Database=require(path.join(process.env.HOME,'xemtuvi.vn/node_modules/better-sqlite3'));
const { chromium } = require(path.join(process.env.HOME,'cong-cu/pw/node_modules/playwright'));
const U='https://v3.xemtuvi.vn:8443', OUT='/tmp/be7/shots';
let loi=0; const ok=(c,m)=>{console.log(c?'DAT ':'HONG',m); if(!c) loi++;};
const api=(p,m,u,b)=>p.evaluate(async([m,u,b])=>{const r=await fetch(u,{method:m,headers:b?{'content-type':'application/json'}:{},body:b?JSON.stringify(b):undefined});let t=await r.text();return {s:r.status,t};},[m,u,b]);
const J=r=>{try{return JSON.parse(r.t)}catch{return {}}};
(async()=>{
 const b=await chromium.launch({args:['--host-resolver-rules=MAP v3.xemtuvi.vn 127.0.0.1']});
 const ctx=await b.newContext({viewport:{width:375,height:812}}); const p=await ctx.newPage();
 const email=`kt-be7-${Date.now()}@example.vn`;
 await p.goto(U+'/');
 ok(p.url().startsWith('https://'),'trang mở bằng HTTPS, chứng chỉ hợp lệ (không ignoreHTTPSErrors)');
 // --- HTTPS + cookie
 let r=await api(p,'POST','/api/dang-nhap',{email}); ok(r.s===200,'đăng nhập qua HTTPS 200 '+r.s);
 const ck=(await ctx.cookies()).find(c=>c.name==='xtv_phien');
 ok(ck&&ck.secure&&ck.httpOnly&&ck.sameSite==='Lax','cookie xtv_phien: Secure='+ck?.secure+' HttpOnly='+ck?.httpOnly+' SameSite='+ck?.sameSite+' hạn(ngày)='+Math.round((ck.expires*1000-Date.now())/864e5));
 r=await api(p,'GET','/api/toi'); ok(J(r).dangNhap===true,'trình duyệt gửi lại cookie Secure qua HTTPS: /api/toi dangNhap=true');
 // --- 4 lá số + thành viên
 const sinh=n=>({thongTinSinh:{lich:'duong',ngay:n,thang:2,nam:1990+n,gio:6,phut:0,gioiTinh:'nu',ten:'LS'+n}});
 const ids=[]; for(let i=1;i<=4;i++){ r=await api(p,'POST','/api/la-so',sinh(i)); ids.push(J(r).id); console.log('  lưu lá số',i,r.s,r.t.slice(0,90)); }
 ok(ids.slice(0,3).every(Boolean),'lưu 3 lá số đầu OK');
 ok(r.s!==200,'LÁ SỐ THỨ 4 BỊ CHẶN? status='+r.s+' '+r.t.slice(0,100));
 const don=J(await api(p,'POST','/api/don-hang',{maGoi:'thanh-vien-nam'}));
 r=await api(p,'POST','/api/thanh-toan/gia-lap',{donHangId:don.id}); ok(r.s===200,'mua thành viên năm (giả lập) '+r.s);
 const t=J(await api(p,'GET','/api/toi')); console.log('  quyen',JSON.stringify(t.quyen), 'laSoIds',t.laSoIds);
 for(let i=0;i<ids.length;i++){ if(!ids[i])continue; r=await api(p,'GET',`/api/luan-giai?laSo=${ids[i]}&chuDe=ban-than`); console.log(`  xem lá số #${i+1} (id ${ids[i]}) -> ${r.s} ${r.s!==200?r.t.slice(0,80):''}`); ids[i]={id:ids[i],s:r.s}; }
 ok(ids.slice(0,3).every(x=>x.s===200),'thành viên xem được 3 lá số đầu');
 if(ids[3]&&ids[3].id) console.log('  lá số 4: lưu được, xem ->',ids[3].s);
 // dùng giao diện 375px
 await p.goto(U+'/luan-giai'); await p.waitForTimeout(2500); await p.screenshot({path:OUT+'/be7-375-thanh-vien-4-la-so.png',fullPage:true});
 console.log('  chữ trang /luan-giai:', (await p.locator('body').innerText()).replace(/\s+/g,' ').slice(0,300));
 // --- hết hạn phiên
 const db=new Database('/tmp/be7/data/csdl/xemtuvi.db');
 const hang=()=>db.prepare('SELECT COUNT(*) n FROM phien').get().n;
 console.log('  số phiên trong CSDL trước:',hang());
 db.prepare('UPDATE phien SET het_han=?').run(Date.now()+6000);
 r=await api(p,'GET','/api/toi'); ok(J(r).dangNhap===true,'(1) phiên còn 6 giây: vẫn đăng nhập');
 await p.waitForTimeout(7000);
 r=await api(p,'GET','/api/toi'); ok(J(r).dangNhap===false,'(2) sau khi hết hạn: /api/toi dangNhap=false '+r.t);
 ok(hang()===0,'(3) dòng phiên hết hạn bị xóa khỏi CSDL, còn '+hang());
 r=await api(p,'GET',`/api/luan-giai?laSo=${ids[0].id}&chuDe=ban-than`); ok(r.s===401,'API luận giải sau hết hạn: 401 (được '+r.s+')');
 r=await api(p,'GET','/api/la-so'); ok(r.s===401,'API lá số sau hết hạn: 401 (được '+r.s+')');
 r=await api(p,'POST','/api/la-so',sinh(9)); ok(r.s===401,'lưu lá số sau hết hạn: 401 (được '+r.s+')');
 await p.goto(U+'/luan-giai'); await p.waitForSelector('#email-xem',{timeout:8000}).then(()=>ok(true,'(4) giao diện: hết hạn → /luan-giai hiện form đăng nhập lại'),()=>ok(false,'giao diện không hiện form đăng nhập lại: '+p.url())); await p.screenshot({path:OUT+'/be7-375-het-han-dang-nhap-lai.png'});
 const tx=(await p.locator('body').innerText()).replace(/\s+/g,' '); console.log('  thông báo trên trang:',tx.slice(0,200));
 ok(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=0,'không tràn ngang 375px');
 // đăng nhập lại cùng email: dữ liệu còn
 r=await api(p,'POST','/api/dang-nhap',{email}); console.log('  đăng nhập lại cùng email (không mã khôi phục):',r.s,r.t.slice(0,100));
 // dọn
 db.close(); await b.close(); process.exit(loi?1:0);
})().catch(e=>{console.log('LOI',e.message);process.exit(1)});
