// ===== 0. HÀM DÙNG CHUNG =====
function $(id) { return document.getElementById(id); }

// Lấy danh sách tài khoản đã lưu trong trình duyệt (localStorage)
function layTaiKhoan() {
  return JSON.parse(localStorage.getItem("taikhoan")) || [];
}
function luuTaiKhoan(ds) {
  localStorage.setItem("taikhoan", JSON.stringify(ds));
}

// Tạo sẵn 1 tài khoản quản lý để thử nghiệm (chỉ tạo lần đầu)
if (layTaiKhoan().length === 0) {
  luuTaiKhoan([{
    ma: "NV001", hoTen: "Quản trị viên", gioiTinh: "Nam", sdt: "0900000000",
    email: "admin@kimdong.vn", taiKhoan: "admin", matKhau: "123456", quyen: "quanly"
  }]);
}

// Hiện lỗi dưới ô nhập; truyền chuỗi rỗng để xóa lỗi
function datLoi(idInput, idLoi, noiDung) {
  $(idLoi).textContent = noiDung;
  if (idInput) { $(idInput).classList.toggle("invalid", noiDung !== ""); }
}
// Hiện thông báo to ở đầu form (loai = "ok" hoặc "bad")
function hienThongBao(id, noiDung, loai) {
  $(id).textContent = noiDung;
  $(id).className = "msg " + loai;
}

// ===== 1. MENU ĐIỆN THOẠI =====
$("menuBtn").onclick = function () { $("menu").classList.toggle("open"); };

// ===== 2. CHUYỂN QUA LẠI GIỮA 3 FORM =====
function hienForm(ten) {
  var ms = document.querySelectorAll(".msg");   // xóa thông báo cũ khi chuyển form
  for (var k = 0; k < ms.length; k++) { ms[k].className = "msg"; ms[k].textContent = ""; }
  $("formLogin").classList.add("hidden");
  $("formRegister").classList.add("hidden");
  $("formForgot").classList.add("hidden");
  $("tabLogin").classList.remove("active");
  $("tabRegister").classList.remove("active");

  if (ten === "login")    { $("formLogin").classList.remove("hidden");    $("tabLogin").classList.add("active"); }
  if (ten === "register") { $("formRegister").classList.remove("hidden"); $("tabRegister").classList.add("active"); }
  if (ten === "forgot")   { $("formForgot").classList.remove("hidden"); }
}
$("tabLogin").onclick    = function () { hienForm("login"); };
$("tabRegister").onclick = function () { hienForm("register"); };
$("toRegister").onclick  = function (e) { e.preventDefault(); hienForm("register"); };
$("toLogin").onclick     = function (e) { e.preventDefault(); hienForm("login"); };
$("linkForgot").onclick  = function (e) { e.preventDefault(); hienForm("forgot"); };
$("backLogin").onclick   = function (e) { e.preventDefault(); hienForm("login"); };

// ===== 3. NÚT ẨN/HIỆN MẬT KHẨU =====
var eyes = document.querySelectorAll(".eye");
for (var i = 0; i < eyes.length; i++) {
  eyes[i].onclick = function () {
    var o = $(this.getAttribute("data-target"));
    o.type = (o.type === "password") ? "text" : "password";
  };
}

// ===== 4. ĐĂNG NHẬP =====
$("formLogin").onsubmit = function (e) {
  e.preventDefault();
  var user = $("lgUser").value.trim();
  var pass = $("lgPass").value;
  var ok = true;

  datLoi("lgUser", "lgUserErr", ""); datLoi("lgPass", "lgPassErr", "");
  if (user === "") { datLoi("lgUser", "lgUserErr", "Vui lòng nhập tài khoản"); ok = false; }
  if (pass === "") { datLoi("lgPass", "lgPassErr", "Vui lòng nhập mật khẩu"); ok = false; }
  if (!ok) return;
  if (dangBiKhoa()) return;   // đang bị khóa tạm thì không xử lý

  var ds = layTaiKhoan();
  var tim = null;
  for (var i = 0; i < ds.length; i++) {
    if (ds[i].taiKhoan === user && ds[i].matKhau === pass) { tim = ds[i]; }
  }

  if (tim === null) {
    saiThem();   // tăng số lần sai, quá 5 lần thì khóa tạm
    return;
  }
  xoaSaiDangNhap();   // đăng nhập đúng thì xóa bộ đếm số lần sai

  // Lưu trạng thái đăng nhập: tick "Ghi nhớ" thì lưu lâu dài, không thì lưu tạm
  var kho = $("lgRemember").checked ? localStorage : sessionStorage;
  kho.setItem("dangNhap", JSON.stringify({ ma: tim.ma, hoTen: tim.hoTen, quyen: tim.quyen }));

  hienThongBao("lgMsg", "Đăng nhập thành công! Đang chuyển về trang chủ...", "ok");
  setTimeout(function () { window.location.href = "index.html"; }, 1200);
};

// ===== 5. ĐĂNG KÝ =====
$("formRegister").onsubmit = function (e) {
  e.preventDefault();
  var ten   = $("rgName").value.trim();
  var sdt   = $("rgPhone").value.trim();
  var email = $("rgEmail").value.trim();
  var user  = $("rgUser").value.trim();
  var pass  = $("rgPass").value;
  var pass2 = $("rgPass2").value;
  var ok = true;

  // Xóa lỗi cũ
  datLoi("rgName", "rgNameErr", "");   datLoi("rgPhone", "rgPhoneErr", "");
  datLoi("rgEmail", "rgEmailErr", ""); datLoi("rgUser", "rgUserErr", "");
  datLoi("rgPass", "rgPassErr", "");   datLoi("rgPass2", "rgPass2Err", "");
  datLoi("", "rgAgreeErr", "");

  // Kiểm tra từng ô
  if (ten === "") { datLoi("rgName", "rgNameErr", "Vui lòng nhập họ tên"); ok = false; }
  if (!/^0\d{9}$/.test(sdt)) { datLoi("rgPhone", "rgPhoneErr", "SĐT gồm 10 số, bắt đầu bằng 0"); ok = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { datLoi("rgEmail", "rgEmailErr", "Email không hợp lệ"); ok = false; }
  if (!/^[a-zA-Z0-9_]{4,}$/.test(user)) { datLoi("rgUser", "rgUserErr", "Tối thiểu 4 ký tự, chỉ gồm chữ không dấu, số, _"); ok = false; }
  if (pass.length < 6) { datLoi("rgPass", "rgPassErr", "Mật khẩu tối thiểu 6 ký tự"); ok = false; }
  if (pass2 !== pass) { datLoi("rgPass2", "rgPass2Err", "Mật khẩu nhập lại không khớp"); ok = false; }
  if (!$("rgAgree").checked) { datLoi("", "rgAgreeErr", "Bạn cần đồng ý điều khoản"); ok = false; }
  if (!ok) return;

  // Kiểm tra trùng tài khoản / email
  var ds = layTaiKhoan();
  for (var i = 0; i < ds.length; i++) {
    if (ds[i].taiKhoan === user) { datLoi("rgUser", "rgUserErr", "Tên tài khoản đã tồn tại"); return; }
    if (ds[i].email === email)   { datLoi("rgEmail", "rgEmailErr", "Email đã được sử dụng"); return; }
  }

  // Tạo khách hàng mới (quyền mặc định là "khach")
  var so = ds.length + 1;
  ds.push({
    ma: "KH" + String(so).padStart(3, "0"),
    hoTen: ten,
    gioiTinh: document.querySelector('input[name="rgGender"]:checked').value,
    sdt: sdt, email: email, taiKhoan: user, matKhau: pass, quyen: "khach"
  });
  luuTaiKhoan(ds);

  $("formRegister").reset();
  hienForm("login");
  hienThongBao("lgMsg", "Đăng ký thành công! Mời bạn đăng nhập.", "ok");
};

// ===== 6. QUÊN MẬT KHẨU (đặt lại mật khẩu mới) =====
$("formForgot").onsubmit = function (e) {
  e.preventDefault();
  var email = $("fgEmail").value.trim();
  var pass  = $("fgPass").value;
  var ok = true;

  datLoi("fgEmail", "fgEmailErr", ""); datLoi("fgPass", "fgPassErr", "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { datLoi("fgEmail", "fgEmailErr", "Email không hợp lệ"); ok = false; }
  if (pass.length < 6) { datLoi("fgPass", "fgPassErr", "Mật khẩu tối thiểu 6 ký tự"); ok = false; }
  if (!ok) return;

  var ds = layTaiKhoan();
  for (var i = 0; i < ds.length; i++) {
    if (ds[i].email === email) {
      ds[i].matKhau = pass;
      luuTaiKhoan(ds);
      $("formForgot").reset();
      hienForm("login");
      hienThongBao("lgMsg", "Đã đổi mật khẩu. Hãy đăng nhập lại!", "ok");
      return;
    }
  }
  hienThongBao("fgMsg", "Không tìm thấy tài khoản dùng email này!", "bad");
};

// ===== 7. ẨN ẢNH LỖI =====
var imgs = document.querySelectorAll("img");
for (var j = 0; j < imgs.length; j++) {
  imgs[j].onerror = function () { this.style.display = "none"; };
}

// ===== 8. XÓA LỖI KHI NGƯỜI DÙNG BẮT ĐẦU GÕ LẠI =====
var oNhap = document.querySelectorAll(".field input[type='text'], .field input[type='password']");
for (var n = 0; n < oNhap.length; n++) {
  oNhap[n].addEventListener("input", function () {
    datLoi(this.id, this.id + "Err", "");   // ví dụ: rgUser -> rgUserErr
  });
}

// ===== 9. ĐO ĐỘ MẠNH MẬT KHẨU (form đăng ký) =====
$("rgPass").addEventListener("input", function () {
  var p = this.value;
  var diem = 0;
  if (p.length >= 6) diem++;
  if (p.length >= 10) diem++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) diem++;   // có cả chữ thường và chữ hoa
  if (/\d/.test(p)) diem++;                          // có số
  if (/[^a-zA-Z0-9]/.test(p)) diem++;                // có ký tự đặc biệt

  var thanh = $("rgStrengthBar");
  var chu = $("rgStrengthText");
  if (p === "") { thanh.style.width = "0"; chu.textContent = ""; return; }

  if (diem <= 2)      { thanh.style.width = "33%";  thanh.style.background = "#d71920"; chu.textContent = "Độ mạnh: Yếu";       chu.style.color = "#d71920"; }
  else if (diem === 3){ thanh.style.width = "66%";  thanh.style.background = "#f5a623"; chu.textContent = "Độ mạnh: Trung bình"; chu.style.color = "#d98a00"; }
  else                { thanh.style.width = "100%"; thanh.style.background = "#2e9e4f"; chu.textContent = "Độ mạnh: Mạnh";       chu.style.color = "#1b7a34"; }
});

// ===== 10. KHÓA TẠM THỜI KHI ĐĂNG NHẬP SAI NHIỀU LẦN =====
var TOI_DA_SAI = 5;        // sai 5 lần thì khóa
var THOI_GIAN_KHOA = 30;   // khóa 30 giây
var demNguoc = null;

function laySai() {
  return JSON.parse(localStorage.getItem("saiDangNhap")) || { dem: 0, den: 0 };
}
function dangBiKhoa() {
  return laySai().den > Date.now();
}
function xoaSaiDangNhap() {
  localStorage.removeItem("saiDangNhap");
}
// Gọi mỗi lần đăng nhập sai
function saiThem() {
  var s = laySai();
  s.dem++;
  if (s.dem >= TOI_DA_SAI) {
    s.dem = 0;
    s.den = Date.now() + THOI_GIAN_KHOA * 1000;
    localStorage.setItem("saiDangNhap", JSON.stringify(s));
    batDauDemNguoc();
    return;
  }
  localStorage.setItem("saiDangNhap", JSON.stringify(s));
  hienThongBao("lgMsg", "Sai tài khoản hoặc mật khẩu! (Còn " + (TOI_DA_SAI - s.dem) + " lần thử)", "bad");
}
// Đếm ngược mỗi giây, khóa nút Đăng nhập cho đến khi hết giờ
function batDauDemNguoc() {
  var nut = document.querySelector("#formLogin .btn-main");
  clearInterval(demNguoc);
  function capNhat() {
    var conLai = Math.ceil((laySai().den - Date.now()) / 1000);
    if (conLai <= 0) {
      clearInterval(demNguoc);
      nut.disabled = false;
      hienThongBao("lgMsg", "Đã mở khóa, bạn có thể đăng nhập lại.", "ok");
      return;
    }
    nut.disabled = true;
    hienThongBao("lgMsg", "Sai quá " + TOI_DA_SAI + " lần. Vui lòng thử lại sau " + conLai + " giây.", "bad");
  }
  capNhat();
  demNguoc = setInterval(capNhat, 1000);
}

// ===== 11. KHI MỞ TRANG =====
var daDN = localStorage.getItem("dangNhap") || sessionStorage.getItem("dangNhap");
if (dangBiKhoa()) {
  batDauDemNguoc();                       // vẫn đang bị khóa thì đếm tiếp
} else if (daDN) {
  hienThongBao("lgMsg", "Bạn đang đăng nhập với tên " + JSON.parse(daDN).hoTen + ". Hãy đăng nhập lại nếu muốn đổi tài khoản.", "ok");
}