# Đo lường công cụ /sinh-con-2027: bấm sang lá số / xem kết quả

Người soạn: Quân (phan-tich), việc L-b68c29 theo yêu cầu của Minh. Ngày soạn 31/10/2026. Chỉ đo ẩn danh, không có năm sinh hay dữ liệu định danh.

## 0. Nguồn mã (đính chính)
`ghi-su-kien.ts` mà Minh nhắc **không tồn tại**. Mã thật:
- `src/lib/su-kien.js` dòng ~12 (khai báo 3 sự kiện thuộc màn `sinh-con`) và ~102-122 (`kiemSinhCon`: `xem_ket_qua` chỉ mang `muc` thuộc `thuan | can-bang | can-luu-y`; `co_nhap_ngay_thang` chỉ mang `co` boolean; `bam_sang_la_so` chỉ có `ten`, `phien`).
- `src/app/api/su-kien/route.ts` dòng ~32 (ghi sự kiện sinh-con vào tệp).
- `src/components/SinhCon2027.tsx` dòng ~80-105: mỗi lần bấm "Xem kết quả" gửi **cả hai** `xem_ket_qua` và `co_nhap_ngay_thang`; `bam_sang_la_so` gửi khi bấm nút sang lá số.
- Dữ liệu: `~/xemtuvi-data/su-kien/*.jsonl`, mỗi dòng `{"t":<ms epoch>,"ten","phien","trang","muc"|"co"}`. Chưa có `thietBi` trong 166 dòng sinh-con hiện có.

## 1. Chỉ số
- Mẫu số: số **phiên duy nhất** (`phien`) có ít nhất một `xem_ket_qua`.
- Tử số: số phiên trong mẫu số có ít nhất một `bam_sang_la_so`.
- Tỉ lệ = tử số / mẫu số. Phiên chỉ có `bam_sang_la_so` mà không có `xem_ket_qua` thì không tính vào tử số (báo riêng, hiện 0).
- Tách theo `muc`: `muc` của phiên = giá trị `xem_ket_qua` **cuối cùng** trong phiên (khách đổi tuổi rồi bấm lại thì lấy kết quả khách thấy sau cùng; số phiên đổi mức được báo riêng).
- Tách theo `co`: `co` của phiên = giá trị `co_nhap_ngay_thang` cuối cùng. `true` = có nhập ngày, `false` = không nhập.
- Hai cách tách là hai lát cắt độc lập của cùng một mẫu số, không cộng chéo.

## 2. Ngưỡng và cỡ mẫu
- Đạt: tỉ lệ ≥ 10%.
- Cỡ mẫu: muốn khoảng tin cậy 95% quanh 10% rộng ±5 điểm % (tức phân biệt được 10% với 5% hoặc 15%): n = 1,96² × 0,10 × 0,90 / 0,05² ≈ **139 phiên có xem_ket_qua mỗi nhóm** (kiểm lại bằng Wilson: 10% của 139 phiên cho khoảng khoảng 6%-16%).
- Tối thiểu để kết luận: **TỔNG ≥ 139 phiên**. Đọc theo `muc` hoặc theo `co`: mỗi nhóm muốn kết luận phải đủ 139, nên tổng cần ≥ 417 (3 mức) nếu chia đều; thực tế mức `thuan` và `can-luu-y` ít hơn (mẫu thử: 1 và 2 trên 19 phiên) và nhóm `co=true` cũng ít (9 trên 19), nên tổng thực tế có thể cần cao hơn nhiều. Nhóm nào chưa đủ 139 thì ghi "chưa đủ mẫu", không rút kết luận.
- Quy tắc kết luận (dùng cận Wilson 95% do script in ra): cận dưới ≥ 10% = đạt chắc; cận trên < 10% = chưa đạt chắc; còn lại = chưa kết luận, chỉ báo xu hướng. Tỉ lệ điểm ≥ 10% nhưng cận dưới < 10% chỉ gọi là "có vẻ đạt".

## 3. Mốc đọc số sau 16/11 (bản thử kín)
- Cửa sổ đọc: từ 16/11/2026 00:00 (giờ VN) trở đi (đặt `TU=2026-11-16`); dữ liệu 30-31/10 là kiểm thử nội bộ, không tính.
- Lần đọc 1: **thứ Hai 23/11/2026, 09:00** (7 ngày bản thử kín, đủ chu kỳ cuối tuần).
- Lần đọc 2 (nếu chưa đủ 139): **sáng 27/11/2026** trước giờ ra mắt, để Minh/Hoàng có số trước quyết định.
- Vẫn chưa đủ ở 27/11: kết luận ghi "chưa đủ mẫu, chưa quyết", kèm tỉ lệ và khoảng tin cậy, không chỉnh ngưỡng. Đọc tiếp **thứ Hai 7/12/2026** (sau ra mắt có ads, mẫu tăng nhanh), rồi mỗi tuần cho tới khi đủ. Không dừng sớm chỉ vì một lần đọc trông đẹp.
- Báo cho Vy/Hoàng sau mỗi lần đọc, ≤ 10 dòng.

## 4. Lệnh đọc số (dán chạy được)
Chạy: `TU=2026-11-16 python3 -I - <<'E'` rồi dán nội dung dưới, kết thúc bằng dòng `E` (hoặc lưu thành `doc.py` rồi `TU=2026-11-16 python3 -I doc.py`). Không đặt `TU` thì đọc toàn bộ. `DEN` tùy chọn (mặc định bây giờ; bỏ mọi dòng có `t` ở tương lai).

```python
import json,glob,os,sys,math,time,datetime,collections
VN=datetime.timezone(datetime.timedelta(hours=7))
def ms(s): return int(datetime.datetime.fromisoformat(s).replace(tzinfo=VN).timestamp()*1000) if s else None
TU=ms(os.environ.get('TU')); DEN=ms(os.environ.get('DEN')) or int(time.time()*1000)  # TU/DEN dạng 2026-11-16 hoặc 2026-11-16T09:00
GIA={'2026-12-10','2026-12-16','2026-12-19','2026-12-20','2027-02-07'}  # tệp giả lập đã biết
ev=[];bo=collections.Counter()
for f in sorted(glob.glob(os.path.expanduser('~/xemtuvi-data/su-kien/*.jsonl'))):
    if os.path.basename(f)[:-6] in GIA: bo['tep_gia']+=1; continue
    for l in open(f):
        try: d=json.loads(l)
        except ValueError: bo['dong_hong']+=1; continue
        if d.get('ten') not in('xem_ket_qua','co_nhap_ngay_thang','bam_sang_la_so'): continue
        if d['t']>DEN or (TU and d['t']<TU): bo['ngoai_cua_so']+=1; continue
        ev.append(d)
ev.sort(key=lambda d:d['t']); P=collections.defaultdict(lambda:{'muc':None,'co':None,'bam':False,'n':0,'muc_khac':set()})
tho=len(ev); loai=0; last={}
for d in ev:  # bỏ bản ghi trùng: cùng phiên+ten+nội dung, cách bản trước <=3 giây
    k=(d['phien'],d['ten'],d.get('muc'),d.get('co'))
    if k in last and d['t']-last[k]<=3000: loai+=1; last[k]=d['t']; continue
    last[k]=d['t']; p=P[d['phien']]; p['n']+=1
    if d['ten']=='xem_ket_qua':
        if p['muc']: p['muc_khac'].add(p['muc'])
        p['muc']=d['muc']
    elif d['ten']=='co_nhap_ngay_thang': p['co']=d['co']
    else: p['bam']=True
def wilson(x,n):
    if n==0: return (0,0)
    z=1.96;p=x/n;c=(p+z*z/2/n)/(1+z*z/n);h=z*math.sqrt(p*(1-p)/n+z*z/4/n/n)/(1+z*z/n);return (c-h,c+h)
def dong(ten,ps):
    n=len(ps);x=sum(p['bam'] for p in ps);lo,hi=wilson(x,n)
    print(f"{ten:<22} xem_ket_qua={n:<4} bam={x:<4} ti_le={(100*x/n if n else 0):5.1f}%  KTC95=[{100*lo:.1f}%-{100*hi:.1f}%]  {'DAT' if n and x/n>=.1 else 'chua dat'}{'  (n<139: chua du mau)' if n<139 else ''}")
M=[p for p in P.values() if p['muc']]
print(f"Cua so: {os.environ.get('TU','dau')} -> {datetime.datetime.fromtimestamp(DEN/1000,VN):%F %H:%M}; ban ghi doc={tho}, loai trung={loai}, bo={dict(bo)}")
print(f"Phien co su kien={len(P)}; phien co xem_ket_qua={len(M)}; phien bam nhung khong co xem_ket_qua={sum(p['bam'] and not p['muc'] for p in P.values())}; phien doi muc giua chung={sum(bool(p['muc_khac']-{p['muc']}) for p in M)}")
dong('TONG',M)
for m in ('thuan','can-bang','can-luu-y'): dong('muc='+m,[p for p in M if p['muc']==m])
dong('co_nhap_ngay=true',[p for p in M if p['co'] is True]); dong('co_nhap_ngay=false',[p for p in M if p['co'] is False])
```

### Kết quả chạy thật ngày 31/10/2026 14:11 (không đặt TU, toàn bộ dữ liệu thật tới hiện tại)
```
Cua so: dau -> 2026-10-31 14:11; ban ghi doc=166, loai trung=117, bo={'tep_gia': 5}
Phien co su kien=19; phien co xem_ket_qua=19; phien bam nhung khong co xem_ket_qua=0; phien doi muc giua chung=1
TONG                   xem_ket_qua=19   bam=2    ti_le= 10.5%  KTC95=[2.9%-31.4%]  DAT  (n<139: chua du mau)
muc=thuan              xem_ket_qua=1    bam=0    ti_le=  0.0%  KTC95=[0.0%-79.3%]  chua dat  (n<139: chua du mau)
muc=can-bang           xem_ket_qua=16   bam=2    ti_le= 12.5%  KTC95=[3.5%-36.0%]  DAT  (n<139: chua du mau)
muc=can-luu-y          xem_ket_qua=2    bam=0    ti_le=  0.0%  KTC95=[0.0%-65.8%]  chua dat  (n<139: chua du mau)
co_nhap_ngay=true      xem_ket_qua=9    bam=1    ti_le= 11.1%  KTC95=[2.0%-43.5%]  DAT  (n<139: chua du mau)
co_nhap_ngay=false     xem_ket_qua=10   bam=1    ti_le= 10.0%  KTC95=[1.8%-40.4%]  DAT  (n<139: chua du mau)
```
Chỉ có 19 phiên: cỡ mẫu rất nhỏ (cận trên 31%, dưới 10% cũng chưa loại được), đây là dữ liệu thử nội bộ, **chưa phải kết luận**. Một phiên đơn lẻ có 59 lần bấm là kiểm thử lặp.

### Kết quả với TU=2026-11-16 (chạy ngày 31/10, chưa có dữ liệu nên bằng 0, kiểm tra lệnh lọc cửa sổ hoạt động)
```
Cua so: 2026-11-16 -> 2026-10-31 14:11; ban ghi doc=0, loai trung=0, bo={'ngoai_cua_so': 166, 'tep_gia': 5}
Phien co su kien=0; phien co xem_ket_qua=0; phien bam nhung khong co xem_ket_qua=0; phien doi muc giua chung=0
TONG                   xem_ket_qua=0    bam=0    ti_le=  0.0%  KTC95=[0.0%-0.0%]  chua dat  (n<139: chua du mau)
muc=thuan              xem_ket_qua=0    bam=0    ti_le=  0.0%  KTC95=[0.0%-0.0%]  chua dat  (n<139: chua du mau)
muc=can-bang           xem_ket_qua=0    bam=0    ti_le=  0.0%  KTC95=[0.0%-0.0%]  chua dat  (n<139: chua du mau)
muc=can-luu-y          xem_ket_qua=0    bam=0    ti_le=  0.0%  KTC95=[0.0%-0.0%]  chua dat  (n<139: chua du mau)
co_nhap_ngay=true      xem_ket_qua=0    bam=0    ti_le=  0.0%  KTC95=[0.0%-0.0%]  chua dat  (n<139: chua du mau)
co_nhap_ngay=false     xem_ket_qua=0    bam=0    ti_le=  0.0%  KTC95=[0.0%-0.0%]  chua dat  (n<139: chua du mau)
```

## 5. Bản ghi trùng (L-4c7b95, Tùng đang sửa) và cách lọc tạm
Hiện tượng thấy trong dữ liệu: 166 dòng sinh-con chỉ thuộc 19 phiên; 117 dòng bị lọc là trùng (cùng phiên + tên + nội dung, cách dòng trước ≤ 3 giây; các cặp trùng quan sát cách nhau 0,5-1,2 giây).
Lọc tạm (đã nằm trong script):
1. Đếm theo **phiên duy nhất**, không đếm dòng.
2. Bỏ dòng cùng `phien` + `ten` + `muc`/`co` cách dòng trước ≤ 3 giây (chủ yếu để số "dòng" in ra không phồng; không đổi kết quả phiên).
3. Cùng phiên mà `muc` khác nhau (vd `can-bang` rồi `can-luu-y` cách nhau chưa đầy 1 giây) thì lấy giá trị cuối; số phiên như vậy được in riêng (hiện 1).
Ảnh hưởng của trùng nếu **không** lọc, đếm theo dòng: mẫu số `xem_ket_qua` bị phồng (82 dòng so với 19 phiên) trong khi `bam_sang_la_so` chỉ được bấm ít lần, nên tỉ lệ rớt từ 10,5% (2/19, theo phiên) xuống 2,4% (2/82, theo dòng), tức báo "không đạt" sai. Tử số cũng có thể phồng nếu khách bấm nút sang lá số hai lần. Đếm theo phiên khiến trùng không đổi cả tử số lẫn mẫu số. Giới hạn của lọc tạm: nếu lỗi trùng sinh ra **phiên mới** (mã phiên khác) thì cách này không bắt được; khi Tùng sửa xong L-4c7b95 cần chạy lại và so lệch.

## 6. Dữ liệu giả lập / thử cần loại
- Năm tệp `2026-12-10`, `2026-12-16`, `2026-12-19`, `2026-12-20`, `2027-02-07` có mốc `t` ở **tương lai** so với ngày thật (31/10/2026), mọi tệp đều bắt đầu đúng 10:00: dữ liệu mô phỏng. Chúng không chứa sự kiện sinh-con nào (0 dòng) nên chưa làm lệch chỉ số này, nhưng sẽ làm lệch báo cáo phễu khác.
- Cách loại: script bỏ cứng tên năm tệp này (danh sách `GIA`) và bỏ mọi dòng có `t` > `DEN`. Cần danh sách cứng vì tới 10/12 các tệp ấy sẽ trở thành "quá khứ" và lọt qua bộ lọc thời gian. Đề xuất Sơn/Tùng chuyển chúng ra khỏi thư mục `su-kien/` hoặc đổi đuôi (không xoá).
- Dữ liệu 30-31/10 là kiểm thử nội bộ (phiên 59 lần bấm): loại bằng `TU=2026-11-16`.
