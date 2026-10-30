const path=require('path');
const { chromium } = require(path.join(process.env.HOME,'cong-cu/pw/node_modules/playwright'));
const U='http://localhost:3100', OUT='/tmp/be5';
const KQ=[]; const ghi=(ca,ok,ct)=>{KQ.push({ca,ok,ct});console.log(ok?'DAT ':'HONG',ca,'|',ct||'');};
const email=`phuc-${Date.now()}@example.vn`, email2=`khac-${Date.now()}@example.vn`;
const H={origin:U,'content-type':'application/json'};
(async()=>{
 const b=await chromium.launch();
 const A=await b.newContext({viewport:{width:375,height:812}}); const B=await b.newContext({viewport:{width:1366,height:768}});
 const C=await b.newContext({viewport:{width:1366,height:768}});
 const a=await A.newPage(); const errs=[]; a.on('pageerror',e=>errs.push(e.message));
 // A: lập lá số, mua trọn lá số
 await a.goto(U+'/'); await a.getByLabel('Nữ').check(); await a.getByLabel('Ngày sinh').fill('15'); await a.getByLabel('Tháng sinh').fill('8');
 await a.getByLabel('Năm sinh').fill('1995'); await a.getByLabel('Giờ sinh').selectOption({index:5}); await a.getByLabel('Phút sinh').fill('30');
 await a.getByRole('button',{name:'Lập lá số'}).click(); await a.waitForSelector('.tom-tat');
 // Chưa đăng nhập: API
 for (const [m,u] of [['GET','/api/luan-giai?laSo=1&chuDe=ban-than'],['GET','/api/toi'],['GET','/api/la-so']]) { const r=await A.request.get(U+u); ghi(`chưa đăng nhập ${u}`, m==='GET' && (u.includes('toi')?r.status()===200:r.status()===401), r.status()+' '+(await r.text()).slice(0,80)); }
 await a.getByRole('link',{name:'Xem luận giải chuyên sâu'}).click(); await a.waitForURL('**/chon-goi');
 await a.locator('.the-goi.noi-bat .nut-chinh').click(); await a.waitForURL('**/thanh-toan?goi=tron-la-so');
 await a.getByLabel('Email của bạn').fill(email); await a.getByRole('button',{name:'Tiếp tục với Google'}).click(); await a.waitForSelector('.da-dang-nhap');
 // Trước khi trả tiền: đã có lá số/đơn? kiểm 403
 let r=await A.request.get(U+'/api/toi'); let j=await r.json(); ghi('A đăng nhập, chưa trả: /api/toi quyền rỗng', j.dangNhap&&j.quyen.length===0, JSON.stringify(j));
 let ls;
 let t;
 await a.screenshot({path:OUT+'/A-375-truoc-khi-tra.png'});
 await a.getByRole('button',{name:'Thanh toán (giả lập)'}).click(); await a.waitForURL('**/luan-giai'); await a.waitForSelector('.tom-tat'); await a.waitForTimeout(1500);
 await a.screenshot({path:OUT+'/A-375-luan-giai.png',fullPage:true});
 const txtA=await a.locator('body').innerText();
 ghi('A sau mua thấy luận giải (375px)', /Bản thân|Tình cảm/.test(txtA)&&!/Bạn chưa mở gói/.test(txtA), txtA.slice(0,0)+'tràn ngang '+await a.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
 j=await (await A.request.get(U+'/api/toi')).json(); ls=j.laSoIds[0]; const q=j.quyen; ghi('A có đúng 1 quyền tron_la_so', q.length===1&&q[0].loai==='tron_la_so', JSON.stringify(q));
 r=await A.request.get(`${U}/api/luan-giai?laSo=${ls}&chuDe=ban-than`); t=await r.text(); ghi('A đã mua → 200 có nội dung', r.status()===200&&/nhanDinh/.test(t), r.status()+' len '+t.length);
 for (const cd of ['tai-chinh','gia-dao']) { r=await A.request.get(`${U}/api/luan-giai?laSo=${ls}&chuDe=${cd}`); ghi('chủ đề '+cd+' (biết trước 404)', r.status()===404, r.status()); }
 // thanh toán 2 lần: tạo đơn mới tron-la-so? dùng đơn 1 id
 const don=await (await A.request.post(U+'/api/don-hang',{headers:H,data:{maGoi:'mot-chu-de',chuDe:'su-nghiep',laSoId:ls,soTien:1}})).json();
 ghi('đơn mới bỏ qua soTien từ trình duyệt', don.soTien===29000, JSON.stringify(don));
 const p1=await A.request.post(U+'/api/thanh-toan/gia-lap',{headers:H,data:{donHangId:don.id}}); const p1j=await p1.json();
 const p2=await A.request.post(U+'/api/thanh-toan/gia-lap',{headers:H,data:{donHangId:don.id}}); const p2j=await p2.json();
 const p3=await Promise.all([1,2,3].map(()=>A.request.post(U+'/api/thanh-toan/gia-lap',{headers:H,data:{donHangId:don.id}}).then(x=>x.json())));
 j=await (await A.request.get(U+'/api/toi')).json();
 const nCD=j.quyen.filter(x=>x.loai==='chu_de'&&x.chuDe==='su-nghiep').length;
 ghi('thanh toán giả lập nhiều lần không cấp quyền 2 lần', nCD===1&&p1j.daCapMoi===true&&p2j.daCapMoi===false&&p3.every(x=>x.daCapMoi===false), `lần1 ${JSON.stringify(p1j)} lần2 ${JSON.stringify(p2j)} song song ${JSON.stringify(p3.map(x=>x.daCapMoi))} quyền su-nghiep=${nCD}`);
 // Origin
 const post=(ctx,u,h,d)=>ctx.request.post(U+u,{headers:h,data:d});
 for (const [ten,h] of [['thiếu Origin',{'content-type':'application/json'}],['Origin lạ',{origin:'https://evil.example','content-type':'application/json'}],['Origin gần giống',{origin:U+'.evil.example','content-type':'application/json'}]]) {
  for (const u of ['/api/dang-nhap','/api/dang-xuat','/api/la-so','/api/don-hang','/api/thanh-toan/gia-lap']) { r=await post(A,u,h,{email:'x@y.vn',donHangId:don.id,maGoi:'tron-la-so'}); ghi(`POST ${u} ${ten} bị từ chối`, r.status()===403||r.status()===400&&false, r.status()); }
 }
 // Máy B: đăng nhập cùng email bằng API từ trang (cookie trong trình duyệt B)
 const bp=await B.newPage(); await bp.goto(U+'/');
 j=await (await B.request.get(U+'/api/toi')).json(); ghi('máy B chưa đăng nhập không thấy gì', j.dangNhap===false, JSON.stringify(j));
 r=await post(B,'/api/dang-nhap',H,{email}); ghi('máy B đăng nhập cùng email', r.ok(), r.status());
 const hdr=r.headers()['set-cookie']||''; ghi('cookie HttpOnly;Secure;SameSite=Lax', /HttpOnly/.test(hdr)&&/Secure/.test(hdr)&&/SameSite=Lax/.test(hdr), hdr.replace(/=[^;]+/,'=***').slice(0,120));
 j=await (await B.request.get(U+'/api/toi')).json(); ghi('máy B thấy gói đã mua (API)', j.quyen.some(x=>x.loai==='tron_la_so'), JSON.stringify(j.quyen.map(x=>x.loai)));
 r=await B.request.get(`${U}/api/luan-giai?laSo=${ls}&chuDe=tinh-cam`); ghi('máy B xem luận giải qua API', r.status()===200, r.status());
 await bp.goto(U+'/luan-giai'); await bp.waitForTimeout(2500); await bp.screenshot({path:OUT+'/B-1366-luan-giai.png',fullPage:true});
 const bUrl=bp.url(); const bTxt=await bp.locator('body').innerText();
 ghi('máy B mở /luan-giai bằng giao diện thấy gói (không lá số trong sessionStorage)', bUrl.endsWith('/luan-giai')&&/Tình cảm|Bản thân/.test(bTxt), 'URL cuối '+bUrl+' | '+bTxt.replace(/\s+/g,' ').slice(0,100));
 // Người khác C
 await C.newPage(); r=await post(C,'/api/dang-nhap',H,{email:email2});
 const myLs=await (await post(C,'/api/la-so',H,{thongTinSinh:{lich:'duong',ngay:1,thang:2,nam:1990,gio:6,phut:0,gioiTinh:'nam'}})).json();
 r=await C.request.get(`${U}/api/luan-giai?laSo=${myLs.id}&chuchuDe=x`);
 r=await C.request.get(`${U}/api/luan-giai?laSo=${myLs.id}&chuDe=ban-than`); t=await r.text(); ghi('chưa mua (lá số của chính mình) → 403 không kèm nội dung', r.status()===403&&!/nhanDinh|"muc"/.test(t), myLs.id+' '+r.status()+' '+t.slice(0,100));
 j=await (await C.request.get(U+'/api/toi')).json(); ghi('người khác: không có quyền, không thấy lá số mình', j.quyen.length===0&&!j.laSoIds.includes(ls), JSON.stringify(j));
 for (const u of [`/api/luan-giai?laSo=${ls}&chuDe=ban-than`,`/api/luan-giai?laSo=${ls}&chuDe=van-10-nam`]) {r=await C.request.get(U+u); t=await r.text(); ghi('người khác GET '+u, r.status()===403&&!/nhanDinh/.test(t), r.status()+' '+t.slice(0,80));}
 r=await C.request.get(U+'/api/la-so'); t=await r.text(); ghi('người khác GET /api/la-so không lộ lá số', !/1995/.test(t), t.slice(0,80));
 r=await post(C,'/api/don-hang',H,{maGoi:'tron-la-so',laSoId:ls}); ghi('người khác tạo đơn trên lá số của mình → từ chối', r.status()===403, r.status()+' '+(await r.text()).slice(0,80));
 r=await post(C,'/api/thanh-toan/gia-lap',H,{donHangId:don.id}); ghi('người khác thanh toán đơn của mình → 404', r.status()===404, r.status());
 const c2=await (await post(C,'/api/don-hang',H,{maGoi:'tron-la-so',laSoId:999999})).status(); ghi('lá số không tồn tại', c2===403, c2);
 // HTML/JS không chứa nội dung trả phí
 const kh=await b.newContext(); const kp=await kh.newPage(); const body=[]; kp.on('response',async x=>{try{const ct=x.headers()['content-type']||''; if(/html|javascript|json/.test(ct)) body.push([x.url(),await x.text()]);}catch{}});
 for (const u of ['/','/chon-goi','/thanh-toan?goi=tron-la-so','/luan-giai']) { await kp.goto(U+u); await kp.waitForTimeout(800); }
 const mau=['Mệnh cung','nhanDinh','quyTacId','thamChieu'];
 const lo=body.filter(([u,t])=>/nhanDinh|quyTacId|thamChieu/.test(t)).map(x=>x[0]);
 ghi('HTML/JS/JSON khách chưa mua không chứa khóa nội dung trả phí (nhanDinh/quyTacId/thamChieu)', lo.length===0, `${body.length} tài nguyên; vi phạm: ${lo.join(',')}`);
 // so với nội dung thật: lấy 1 câu nhận định thật
 const real=JSON.parse(await (await A.request.get(`${U}/api/luan-giai?laSo=${ls}&chuDe=ban-than`)).text()); const cau=real.muc[0].nhanDinh[0].text.slice(0,40);
 ghi('câu luận giải thật không có trong HTML/JS công khai', !body.some(([u,t])=>t.includes(cau)), 'câu: '+cau);
 for (const u of ['/api/dang-nhap']) {}
 // robots, no-store
 r=await A.request.get(U+'/robots.txt'); ghi('robots.txt', true, (await r.text()).replace(/\n/g,' ').slice(0,100));
 r=await A.request.get(`${U}/api/luan-giai?laSo=${ls}&chuDe=ban-than`); ghi('Cache-Control private,no-store', /no-store/.test(r.headers()['cache-control']||''), r.headers()['cache-control']);
 // đăng xuất
 r=await post(B,'/api/dang-xuat',H,{}); j=await (await B.request.get(U+'/api/toi')).json(); ghi('đăng xuất xóa phiên', j.dangNhap===false, JSON.stringify(j));
 // 375 + 1366 trang chính cho khách mới
 const m=await b.newContext({viewport:{width:375,height:812}}); const mp=await m.newPage();
 for (const w of [375,1366]) { await mp.setViewportSize({width:w,height:800}); for (const u of ['/','/chon-goi','/thanh-toan?goi=tron-la-so']) { await mp.goto(U+u); await mp.waitForTimeout(500); const tr=await mp.evaluate(()=>document.documentElement.scrollWidth-innerWidth); ghi(`tràn ngang ${w}px ${u}`, tr<=0, tr); } }
 ghi('không có lỗi JS trang A', errs.length===0, errs.join('|'));
 require('fs').writeFileSync(OUT+'/kq.json',JSON.stringify({email,ls,donId:don.id,KQ},null,1));
 await b.close();
})().catch(e=>{console.error('CRASH',e);process.exit(1)});
