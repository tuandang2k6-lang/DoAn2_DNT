// ===== 1. HÀM DÙNG CHUNG =====
function $(id) { return document.getElementById(id); }

// 1998000 -> "1.998.000đ"
function dinhDangTien(so) {
  return String(so).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}
// Tạo nhanh một thẻ HTML: tao("span", "ten-class", "chữ bên trong")
function tao(tenThe, tenClass, noiDung) {
  var e = document.createElement(tenThe);
  if (tenClass) { e.className = tenClass; }
  if (noiDung !== undefined) { e.textContent = noiDung; }
  return e;
}
function hienThongBao(noiDung) {
  var t = $("toast");
  t.textContent = noiDung;
  t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, 2500);
}

// ===== 2. MENU ĐIỆN THOẠI + ẨN ẢNH LỖI + TÊN KHÁCH HÀNG =====
$("menuBtn").onclick = function () { $("menu").classList.toggle("open"); };

var imgs = document.querySelectorAll("img");
for (var i = 0; i < imgs.length; i++) {
  if (imgs[i].getAttribute("src") && imgs[i].complete && imgs[i].naturalWidth === 0) { imgs[i].style.display = "none"; }
  imgs[i].onerror = function () { this.style.display = "none"; };
}

var userLink = $("userLink");
var dn = localStorage.getItem("dangNhap") || sessionStorage.getItem("dangNhap");
if (userLink && dn) {
  var tt = JSON.parse(dn);
  userLink.title = "Xin chào, " + tt.hoTen + " (bấm để đăng xuất)";
  userLink.textContent = "👤 ";
  var tenHienThi = document.createElement("span");
  tenHienThi.className = "user-name";
  tenHienThi.textContent = tt.hoTen;
  userLink.appendChild(tenHienThi);
  userLink.onclick = function (e) {
    e.preventDefault();
    if (confirm("Xin chào " + tt.hoTen + "!\nBạn muốn đăng xuất?")) {
      localStorage.removeItem("dangNhap");
      sessionStorage.removeItem("dangNhap");
      location.reload();
    }
  };
}

// ===== 3. ĐỌC / GHI GIỎ HÀNG (localStorage, khóa "gioHang") =====
// Mỗi phần tử: { id, ten, anh, gia, giaGoc, soLuong }
function layGioHang() {
  return JSON.parse(localStorage.getItem("gioHang")) || [];
}
function luuGioHang(gh) {
  localStorage.setItem("gioHang", JSON.stringify(gh));
}

// ===== 4. THAY ĐỔI SỐ LƯỢNG / XÓA SẢN PHẨM =====
function doiSoLuong(viTri, soMoi) {
  var gh = layGioHang();
  if (isNaN(soMoi) || soMoi < 1) { soMoi = 1; }
  if (soMoi > 99) { soMoi = 99; }
  gh[viTri].soLuong = soMoi;
  luuGioHang(gh);
  veGioHang();
}
function xoaSanPham(viTri) {
  var gh = layGioHang();
  if (confirm("Bạn muốn xóa \"" + gh[viTri].ten + "\" khỏi giỏ hàng?")) {
    gh.splice(viTri, 1);
    luuGioHang(gh);
    veGioHang();
  }
}

// ===== 5. TẠO MỘT HÀNG SẢN PHẨM TRONG BẢNG =====
function taoDong(sp, viTri) {
  var dong = tao("div", "cart-row");

  // Cột 1: ảnh + tên
  var cotTen = tao("div", "cart-info");
  var anh = tao("img");
  anh.alt = sp.ten;
  anh.onerror = function () { this.style.display = "none"; };
  anh.src = sp.anh;
  cotTen.appendChild(anh);
  cotTen.appendChild(tao("span", "cart-name", sp.ten));
  dong.appendChild(cotTen);

  // Cột 2: đơn giá (giá bán đỏ, giá gốc gạch ngang, nhãn % giảm)
  var cotGia = tao("div", "cart-price");
  cotGia.appendChild(tao("span", "gia-moi", dinhDangTien(sp.gia)));
  if (sp.giaGoc > sp.gia) {
    var phanTram = Math.round((sp.giaGoc - sp.gia) * 100 / sp.giaGoc);
    cotGia.appendChild(tao("del", "gia-cu", dinhDangTien(sp.giaGoc)));
    cotGia.appendChild(tao("span", "badge-giam", "-" + phanTram + "%"));
  }
  dong.appendChild(cotGia);

  // Cột 3: nút - [số] +
  var cotSL = tao("div", "cart-qty");
  var khung = tao("div", "qty");
  var nutGiam = tao("button", "", "-");
  var nutTang = tao("button", "", "+");
  var oSL = tao("input");
  nutGiam.type = "button";
  nutTang.type = "button";
  oSL.type = "text";
  oSL.maxLength = 2;
  oSL.value = sp.soLuong;
  nutGiam.onclick = function () { doiSoLuong(viTri, sp.soLuong - 1); };
  nutTang.onclick = function () { doiSoLuong(viTri, sp.soLuong + 1); };
  oSL.onchange   = function () { doiSoLuong(viTri, parseInt(oSL.value, 10)); };
  khung.appendChild(nutGiam);
  khung.appendChild(oSL);
  khung.appendChild(nutTang);
  cotSL.appendChild(khung);
  dong.appendChild(cotSL);

  // Cột 4: thành tiền = đơn giá x số lượng
  dong.appendChild(tao("div", "cart-total", dinhDangTien(sp.gia * sp.soLuong)));

  // Cột 5: nút xóa
  var nutXoa = tao("button", "btn-xoa", "🗑");
  nutXoa.type = "button";
  nutXoa.title = "Xóa sản phẩm";
  nutXoa.onclick = function () { xoaSanPham(viTri); };
  dong.appendChild(nutXoa);

  return dong;
}

// ===== 6. VẼ TOÀN BỘ GIỎ HÀNG LÊN TRANG =====
function veGioHang() {
  var gh = layGioHang();
  var tongSL = 0, tongTien = 0, tietKiem = 0;

  $("cartList").innerHTML = "";
  for (var k = 0; k < gh.length; k++) {
    $("cartList").appendChild(taoDong(gh[k], k));
    tongSL += gh[k].soLuong;
    tongTien += gh[k].gia * gh[k].soLuong;
    if (gh[k].giaGoc > gh[k].gia) { tietKiem += (gh[k].giaGoc - gh[k].gia) * gh[k].soLuong; }
  }

  $("cartCount").textContent = tongSL;   // số trên icon giỏ hàng

  if (gh.length === 0) {
    $("cartFilled").style.display = "none";
    $("cartEmpty").style.display = "block";
    $("cartTitle").textContent = "GIỎ HÀNG CỦA BẠN";
    return;
  }
  $("cartFilled").style.display = "block";
  $("cartEmpty").style.display = "none";
  $("cartTitle").textContent = "GIỎ HÀNG CỦA BẠN (ĐANG CÓ " + tongSL + " SẢN PHẨM)";
  $("tongTien").textContent = dinhDangTien(tongTien);
  $("tietKiem").textContent = dinhDangTien(tietKiem);
}

// ===== 7. GHI CHÚ ĐƠN HÀNG (tự lưu khi gõ) =====
$("ghiChu").value = localStorage.getItem("ghiChuDonHang") || "";
$("ghiChu").oninput = function () {
  localStorage.setItem("ghiChuDonHang", this.value);
};

// ===== 8. NÚT TIẾN HÀNH THANH TOÁN =====
$("btnThanhToan").onclick = function () {
  if (!dn) {
    if (confirm("Bạn cần đăng nhập để thanh toán.\nChuyển đến trang đăng nhập?")) {
      window.location.href = "dangnhap.html";
    }
    return;
  }
  hienThongBao("Chức năng thanh toán sẽ được bổ sung ở bước tiếp theo");
};

// ===== 9. KHI MỞ TRANG =====
veGioHang();