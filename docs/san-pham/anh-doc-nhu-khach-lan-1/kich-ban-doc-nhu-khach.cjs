const path=require('path');const { chromium, devices } = require(path.join(process.env.HOME,'cong-cu/pw/node_modules/playwright'));
const U='http://localhost:3100', OUT=process.env.HOME+'/xemtuvi.vn/docs/san-pham/anh-doc-nhu-khach-lan-1';
const email=`dnk-${Date.now()}@example.vn`; const T=[]; let t0;
const buoc=async(ten,f)=>{t0=Date.now();await f();const ms=Date.now()-t0;T.push([ten,ms]);console.log(`BUOC ${ten}: ${ms} ms`)};
async function kiemTrang(p,ten){ return p.evaluate(()=>{
  const out={ngang:document.documentElement.scrollWidth-innerWidth,nutNho:[],chuNho:0};
  for(const e of document.querySelectorAll('a,button,input,select,[role=tab]')){const r=e.getBoundingClientRect();if(r.width&&r.height&&(r.height<40||r.width<40)&&getComputedStyle(e).visibility!=='hidden'&&r.top<document.body.scrollHeight)out.nutNho.push((e.innerText||e.getAttribute('aria-label')||e.id||e.tagName).slice(0,30)+` ${Math.round(r.width)}x${Math.round(r.height)}`)}
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;const seen=new Set();while(n=w.nextNode()){if(!n.textContent.trim())continue;const el=n.parentElement;const fs=parseFloat(getComputedStyle(el).fontSize);if(fs<14&&!seen.has(el)){seen.add(el);out.chuNho++;if(out.chuNho<=4)out['vd'+out.chuNho]=el.tagName+' '+fs+'px "'+n.textContent.trim().slice(0,30)+'"'}}
  return out;});}
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({...devices['iPhone 13']}); // 390x664 viewport safari-like
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text().slice(0,100))});
 const cdp=await ctx.newCDPSession(p); await cdp.send('Network.enable');
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8*1.0,uploadThroughput:750*1024/8}); // 4G thường ~1.6Mbps/150ms (Lighthouse)
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 const shot=(n,full)=>p.screenshot({path:`${OUT}/${n}.png`,fullPage:!!full});
 await buoc('H1.1 mở trang chủ (tải)',async()=>{await p.goto(U+'/',{waitUntil:'load'});await p.getByLabel('Nữ').waitFor();});
 await shot('01-trang-chu'); console.log('KT trang chủ',JSON.stringify(await kiemTrang(p)));
 await buoc('H1.2 điền form và bấm Lập lá số',async()=>{await p.getByLabel('Nữ').check();await p.getByLabel('Ngày sinh').fill('15');await p.getByLabel('Tháng sinh').fill('8');await p.getByLabel('Năm sinh').fill('1995');await p.getByLabel('Giờ sinh').selectOption({index:5});await p.getByLabel('Phút sinh').fill('30');await p.getByRole('button',{name:'Lập lá số'}).click();await p.waitForSelector('.tom-tat');});
 await shot('02-la-so-mien-phi',true); console.log('KT lá số',JSON.stringify(await kiemTrang(p)));
 console.log('CHU lá số:',(await p.locator('main').innerText()).replace(/\s+/g,' ').slice(0,700));
 await buoc('H2.1 sang trang chọn gói',async()=>{await p.getByRole('link',{name:'Xem luận giải chuyên sâu'}).click();await p.waitForURL('**/chon-goi');await p.getByRole('button',{name:'Chọn gói này'}).first().waitFor();});
 await shot('03-chon-goi',true); console.log('KT chọn gói',JSON.stringify(await kiemTrang(p)));
 console.log('CHU chọn gói:',(await p.locator('main').innerText()).replace(/\s+/g,' ').slice(0,900));
 await buoc('H3.1 chọn Trọn lá số → thanh toán',async()=>{await p.getByRole('listitem').filter({hasText:'Khuyên dùng'}).getByRole('button').click();await p.waitForURL('**/thanh-toan?goi=tron-la-so');await p.getByLabel('Email của bạn').waitFor();});
 await shot('04-thanh-toan',true); console.log('KT thanh toán',JSON.stringify(await kiemTrang(p)));
 console.log('CHU thanh toán:',(await p.locator('main').innerText()).replace(/\s+/g,' ').slice(0,700));
 await buoc('H3.2 đăng nhập',async()=>{await p.getByLabel('Email của bạn').fill(email);await p.getByRole('button',{name:'Tiếp tục',exact:true}).click();await p.getByRole('button',{name:'Tôi đã lưu mã, tiếp tục'}).waitFor();await shot('04b-ma-khoi-phuc');await p.getByRole('button',{name:'Tôi đã lưu mã, tiếp tục'}).click();await p.getByRole('button',{name:'Thanh toán (giả lập)'}).waitFor();});
 await buoc('H3.3 thanh toán giả lập → bài',async()=>{await p.getByRole('button',{name:'Thanh toán (giả lập)'}).click();await p.waitForTimeout(2500);await shot('04c-sau-thanh-toan',true);console.log('URL',p.url(),(await p.locator('main').innerText()).replace(/\s+/g,' ').slice(0,300));await p.getByRole('link',{name:'Xem luận giải của tôi'}).click();await p.waitForURL('**/luan-giai');await p.waitForSelector('.bai-luan h3');});
 await shot('05-bai-tra-phi-dau'); await shot('06-bai-tra-phi-day-du',true); console.log('KT bài',JSON.stringify(await kiemTrang(p)));
 const bai=await p.locator('.bai-luan').innerText(); console.log('BAI độ dài ký tự',bai.length,'từ',bai.split(/\s+/).length);
 console.log('CAU GAY SO?',JSON.stringify((bai.match(/[^.]*\b(hạn|sát|họa|tai nạn|chết|yểu|giải hạn|cúng|bùa|phá sản|ly hôn|bệnh)\b[^.]*\./gi)||[]).slice(0,8)));
 console.log('CAU ÉP MUA?',JSON.stringify((await p.locator('body').innerText()).match(/[^.\n]*(chỉ còn|hôm nay|ngay bây giờ|nhanh tay|giảm\s*\d+%|sắp hết)[^.\n]*/gi)));
 for(const tab of ['Tình cảm','Sự nghiệp']){ await buoc('H4 mở tab '+tab,async()=>{await p.getByRole('tab',{name:tab}).click();await p.waitForTimeout(800);}); }
 await shot('07-tab-su-nghiep'); console.log('LOI JS',JSON.stringify(errs));
 console.log('TAB trả phí còn xem trước?',(await p.locator('body').innerText()).includes('chưa mở'));
 await p.evaluate(()=>window.scrollTo(0,0));
 // đo tải trang từng trang chính, 4G
 for(const u of ['/','/chon-goi','/thanh-toan?goi=tron-la-so','/luan-giai','/tro-giup']){ const q=await ctx.newPage(); const c=await ctx.newCDPSession(q); await c.send('Network.enable'); await c.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8}); await c.send('Emulation.setCPUThrottlingRate',{rate:4}); const t=Date.now(); await q.goto(U+u,{waitUntil:'load'}); const tl=Date.now()-t; const fcp=await q.evaluate(()=>performance.getEntriesByName('first-contentful-paint')[0]?.startTime|0); const lcp=await q.evaluate(()=>new Promise(r=>{new PerformanceObserver(l=>r(Math.round(l.getEntries().pop().startTime))).observe({type:'largest-contentful-paint',buffered:true});setTimeout(()=>r(-1),1500)})); console.log(`TAI ${u}: load ${tl} ms, FCP ${fcp} ms, LCP ${lcp} ms`); await q.close(); }
 await b.close();
})().catch(e=>{console.log('LOI',e.message);process.exit(1)});
