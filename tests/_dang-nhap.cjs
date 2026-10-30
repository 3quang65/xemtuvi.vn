// Trợ giúp test: bọc x.dangNhap để tự nhớ mã khôi phục lúc tạo tài khoản và tự gửi lại khi cùng email đăng nhập lần nữa.
module.exports = (x) => {
  const goc = x.dangNhap, maDaCap = new Map();
  x.dangNhap = async (req, m) => {
    const b = await req.clone().json();
    const e = String(b.email ?? '').trim().toLowerCase();
    const yc = new Request(req.url, { method: req.method, headers: req.headers, body: JSON.stringify({ ...b, maKhoiPhuc: b.maKhoiPhuc ?? maDaCap.get(e) }) });
    const r = await goc(yc, m);
    const d = await r.clone().json();
    if (d.maKhoiPhuc) maDaCap.set(e, d.maKhoiPhuc);
    return r;
  };
};
