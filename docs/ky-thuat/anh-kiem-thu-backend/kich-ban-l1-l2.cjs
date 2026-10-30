const path=require('path');
const { chromium } = require(path.join(process.env.HOME,'cong-cu/pw/node_modules/playwright'));
const U='http://localhost:3100'; const email=`b6-${Date.now()}@example.vn`;
let loi=0; const ok=(c,m)=>{console.log(c?'DAT ':'HONG',m); if(!c) loi++;};
(async()=>{
 const b=await chromium.launch();
 const A=await b.newContext({viewport:{width:375,height:812}}), B=await b.newContext({viewport:{width:375,height:812}});
 const a=await A.newPage(), p=await B.newPage(); const errs=[]; for (const x of [a,p]) x.on('pageerror',e=>errs.push(e.message));
 await a.goto(U+'/'); await a.getByLabel('Nữ').check(); await a.getByLabel('Ngày sinh').fill('15'); await a.getByLabel('Tháng sinh').fill('8');
 await a.getByLabel('Năm sinh').fill('1995'); await a.getByLabel('Giờ sinh').selectOption({index:5}); await a.getByLabel('Phút sinh').fill('30');
 await a.getByRole('button',{name:'Lập lá số'}).click(); await a.waitForSelector('.tom-tat');
 await a.getByRole('link',{name:'Xem luận giải chuyên sâu'}).click(); await a.waitForURL('**/chon-goi');
 await a.locator('.the-goi.noi-bat .nut-chinh').click(); await a.waitForURL('**/thanh-toan?goi=tron-la-so');
 await a.getByLabel('Email của bạn').fill(email); await a.getByRole('button',{name:'Tiếp tục với Google'}).click(); await a.waitForSelector('.da-dang-nhap');
 await a.getByRole('button',{name:'Thanh toán (giả lập)'}).click(); await a.waitForURL('**/luan-giai'); await a.waitForSelector('.bai-luan');
 // mua thêm 1 chủ đề (qua API, cùng phiên A) để kiểm L2
 const j=await (await A.request.get(U+'/api/toi')).json(); const ls=j.laSoIds[0];
 const H={origin:U,'content-type':'application/json'};
 const don=await (await A.request.post(U+'/api/don-hang',{headers:H,data:{maGoi:'mot-chu-de',chuDe:'su-nghiep',laSoId:ls}})).json();
 await A.request.post(U+'/api/thanh-toan/gia-lap',{headers:H,data:{donHangId:don.id}});
 await a.reload(); await a.waitForSelector('.bai-luan');
 ok((await a.getByRole('tab').count())===4, 'A: sau mua thêm chủ đề vẫn đủ 4 tab (L2); '+(await a.locator('.da-dang-nhap').innerText()));
 // Máy B: vào thẳng /luan-giai, chưa đăng nhập
 await p.goto(U+'/luan-giai'); await p.waitForSelector('#email-xem');
 ok(new URL(p.url()).pathname==='/luan-giai','B: chưa đăng nhập ở lại /luan-giai và thấy form đăng nhập (L1)');
 await p.screenshot({path:'/tmp/be6/B-375-dang-nhap.png'});
 await p.getByLabel('Email bạn đã dùng').fill(email); await p.getByRole('button',{name:'Tiếp tục với Google'}).click(); await p.waitForSelector('.bai-luan');
 const t=await p.locator('body').innerText();
 ok(/Trọn lá số/.test(t),'B: thấy "Đã mở: Trọn lá số"'); ok((await p.getByRole('tab').count())===4,'B: đủ 4 tab chuyên đề');
 ok(await p.locator('.tom-tat').count()===1,'B: có tóm tắt lá số từ máy chủ');
 await p.waitForTimeout(1000);
 ok((await p.locator('.bai-luan h3').count())>0,'B: có nội dung luận');
 for (const [n,pg] of [['A',a],['B',p]]) ok(await pg.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=0, n+': không tràn ngang 375px');
 await p.screenshot({path:'/tmp/be6/B-375-luan-giai.png',fullPage:true});
 // Đăng nhập sai email khác: không thấy gói
 const C=await b.newContext(); const c=await C.newPage(); await c.goto(U+'/luan-giai'); await c.waitForSelector('#email-xem');
 await c.getByLabel('Email bạn đã dùng').fill('nguoi-la-'+Date.now()+'@example.vn'); await c.getByRole('button',{name:'Tiếp tục với Google'}).click();
 await c.getByText('chưa có lá số hay gói nào').waitFor(); ok(true,'C: email khác không thấy gói');
 ok(errs.length===0,'không lỗi JS '+errs.join('|'));
 await b.close(); process.exit(loi?1:0);
})().catch(e=>{console.log('LOI',e.message);process.exit(1)});
