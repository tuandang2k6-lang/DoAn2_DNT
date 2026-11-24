// ===== 0. THÔNG SỐ CHI TIẾT (dữ liệu mẫu - bạn sửa lại theo sách thật) =====
// Khóa = tên truyện viết không dấu, nối bằng gạch ngang (giống mã trên thanh địa chỉ)
// Giá, ảnh, nhãn "Sắp phát hành / Hết hàng" KHÔNG cần ghi ở đây vì lấy thẳng từ thẻ truyện ở trang chủ.
var THONGSO = {
  "tap-le-shikimori-dau-chi-de-thuong-4": {
    ma: "6262216250004", tacGia: ["Keigo Maki"], doiTuong: ["Thiếu niên (11 – 15)", "Tuổi mới lớn (15 – 18)"],
    khuonKho: "11.3x17.6 cm", soTrang: 192, dinhDang: "bìa mềm", trongLuong: "150 gram",
    boSach: "Shikimori đâu chỉ dễ thương"
  },
  "tap-le-bluelock-35": {
    ma: "6262216250035", tacGia: ["Muneyuki Kaneshiro", "Yusuke Nomura"], doiTuong: ["Thiếu niên (11 – 15)", "Tuổi mới lớn (15 – 18)"],
    khuonKho: "11.3x17.6 cm", soTrang: 208, dinhDang: "bìa mềm", trongLuong: "150 gram",
    boSach: "Bluelock"
  },
  "tap-le-meo-sieu-dinh-hom-nay-lai-buon-thiu-1": {
    ma: "6262216250101", tacGia: ["Hitsuzi Yamada"], doiTuong: ["Tuổi mới lớn (15 – 18)"],
    khuonKho: "13x18 cm", soTrang: 160, dinhDang: "bìa mềm", trongLuong: "180 gram",
    boSach: "Mèo siêu đỉnh hôm nay lại buồn thỉu"
  },
  "tap-le-tham-tu-lung-danh-conan-105": {
    ma: "6262216250105", tacGia: ["Aoyama Gosho"], doiTuong: ["Thiếu niên (11 – 15)"],
    khuonKho: "11.3x17.6 cm", soTrang: 184, dinhDang: "bìa mềm", trongLuong: "140 gram",
    boSach: "Thám tử lừng danh Conan"
  },
  "tap-le-doraemon-truyen-dai-tap-25": {
    ma: "6262216250125", tacGia: ["Fujiko F. Fujio"], doiTuong: ["Nhi đồng (6 – 11)", "Thiếu niên (11 – 15)"],
    khuonKho: "11.3x17.6 cm", soTrang: 192, dinhDang: "bìa mềm", trongLuong: "150 gram",
    boSach: "Doraemon - Truyện dài tập"
  },
  "tap-le-kaiju-no-8-tap-12": {
    ma: "6262216250112", tacGia: ["Naoya Matsumoto"], doiTuong: ["Thiếu niên (11 – 15)", "Tuổi mới lớn (15 – 18)"],
    khuonKho: "11.3x17.6 cm", soTrang: 192, dinhDang: "bìa mềm", trongLuong: "150 gram",
    boSach: "Kaiju No.8"
  },
  "doraemon-tap-12": {
    ma: "6262216250212", tacGia: ["Fujiko F. Fujio"], doiTuong: ["Nhi đồng (6 – 11)"],
    khuonKho: "11.3x17.6 cm", soTrang: 192, dinhDang: "bìa mềm", trongLuong: "150 gram",
    boSach: "Doraemon"
  },
  "doraemon-tap-3": {
    ma: "6262216250203", tacGia: ["Fujiko F. Fujio"], doiTuong: ["Nhi đồng (6 – 11)"],
    khuonKho: "11.3x17.6 cm", soTrang: 192, dinhDang: "bìa mềm", trongLuong: "150 gram",
    boSach: "Doraemon"
  },
  "doraemon-tap-10": {
    ma: "6262216250210", tacGia: ["Fujiko F. Fujio"], doiTuong: ["Nhi đồng (6 – 11)"],
    khuonKho: "11.3x17.6 cm", soTrang: 192, dinhDang: "bìa mềm", trongLuong: "150 gram",
    boSach: "Doraemon"
  },
  "one-piece-tap-1": {
    ma: "6262216250201", tacGia: ["Eiichiro Oda"], doiTuong: ["Thiếu niên (11 – 15)"],
    khuonKho: "11.3x17.6 cm", soTrang: 192, dinhDang: "bìa mềm", trongLuong: "150 gram",
    boSach: "One Piece"
  },
  "ngon-doi-hoa-hong-anh": {
    ma: "6262216250301", tacGia: ["Đang cập nhật"], doiTuong: ["Tuổi mới lớn (15 – 18)"],
    khuonKho: "13x20 cm", soTrang: 240, dinhDang: "bìa mềm", trongLuong: "250 gram",
    boSach: "Đang cập nhật"
  },
  "fullmetal-alchemist-tap-1": {
    ma: "6262216250401", tacGia: ["Hiromu Arakawa"], doiTuong: ["Thiếu niên (11 – 15)", "Tuổi mới lớn (15 – 18)"],
    khuonKho: "13x18 cm", soTrang: 224, dinhDang: "bìa mềm", trongLuong: "200 gram",
    boSach: "Fullmetal Alchemist"
  }
};
var CHUA_CO = "Đang cập nhật";   // truyện nào chưa có trong THONGSO thì hiện chữ này

// ===== 1. HÀM DÙNG CHUNG =====
function $(id) { return document.getElementById(id); }

// 31500 -> "31.500đ"
function dinhDangTien(so) {
  return String(so).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

// ===== 2. MENU ĐIỆN THOẠI + ẨN ẢNH LỖI =====
$("menuBtn").onclick = function () { $("menu").classList.toggle("open"); };

var imgs = document.querySelectorAll("img");
for (var i = 0; i < imgs.length; i++) {
  if (imgs[i].getAttribute("src") && imgs[i].complete && imgs[i].naturalWidth === 0) { imgs[i].style.display = "none"; }
  imgs[i].onerror = function () { this.style.display = "none"; };
}

// ===== 3. GIỎ HÀNG (lưu trong localStorage, khóa "gioHang") =====
function layGioHang() {
  return JSON.parse(localStorage.getItem("gioHang")) || [];
}
function capNhatSoLuongGio() {
  var gh = layGioHang();
  var tong = 0;
  for (var k = 0; k < gh.length; k++) { tong += gh[k].soLuong; }
  $("cartCount").textContent = tong;
}
function hienThongBao(noiDung) {
  var t = $("toast");
  t.textContent = noiDung;
  t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, 2200);
}

// ===== 4. LẤY THÔNG TIN TRUYỆN VỪA BẤM Ở TRANG CHỦ VÀ HIỂN THỊ =====
// Trang chủ lưu thẻ truyện đã bấm vào khóa "spDangXem" (tên, ảnh, giá, nhãn...)
// Ví dụ: chitietsanpham.html?id=tap-le-bluelock-35  ->  maSP = "tap-le-bluelock-35"
var maSP = new URLSearchParams(window.location.search).get("id");
var daLuu = JSON.parse(localStorage.getItem("spDangXem"));
var sp = null;

if (daLuu && daLuu.id === maSP) {
  var ts = THONGSO[maSP] || {};
  sp = {
    ten: daLuu.ten, anh: daLuu.anh,
    gia: daLuu.gia, giaGoc: daLuu.giaGoc, giam: daLuu.giam,
    nhan: daLuu.nhan, conHang: !daLuu.hetHang,
    ma: ts.ma || CHUA_CO,
    tacGia: ts.tacGia || [CHUA_CO],
    doiTuong: ts.doiTuong || [CHUA_CO],
    khuonKho: ts.khuonKho || CHUA_CO,
    soTrang: ts.soTrang || CHUA_CO,
    dinhDang: ts.dinhDang || CHUA_CO,
    trongLuong: ts.trongLuong || CHUA_CO,
    boSach: ts.boSach || CHUA_CO
  };
}

if (!sp) {
  $("detail").style.display = "none";
  $("notFound").classList.add("show");
} else {
  document.title = sp.ten + " - NXB Kim Đồng";
  $("ctTenNho").textContent = sp.ten;
  $("ctTen").textContent = sp.ten;

  var anh = $("ctAnh");
  anh.onerror = function () { this.style.display = "none"; };
  anh.src = sp.anh;
  anh.alt = sp.ten;

  // Giá: chỉ hiện giá gốc + tiền tiết kiệm khi thật sự có giảm giá
  $("ctGia").textContent = dinhDangTien(sp.gia);
  if (sp.giaGoc > sp.gia) {
    $("ctGiaCu").textContent = dinhDangTien(sp.giaGoc);
    $("ctTietKiem").textContent = "Bạn đã tiết kiệm được " + dinhDangTien(sp.giaGoc - sp.gia);
  } else {
    $("ctGiaCu").style.display = "none";
    $("ctTietKiem").style.display = "none";
  }
  if (sp.giam > 0) { $("ctGiam").textContent = "-" + sp.giam + "%"; }
  else { $("ctGiam").style.display = "none"; }

  $("ctMa").textContent = sp.ma;
  $("ctTacGia").innerHTML = sp.tacGia.join("<br>");
  $("ctDoiTuong").innerHTML = sp.doiTuong.join("<br>");
  $("ctKhuonKho").textContent = sp.khuonKho;
  $("ctSoTrang").textContent = sp.soTrang;
  $("ctDinhDang").textContent = sp.dinhDang;
  $("ctTrongLuong").textContent = sp.trongLuong;
  $("ctBoSach").textContent = sp.boSach;

  // Nhãn trên ảnh: đỏ "Sắp phát hành" hoặc xám "Hết hàng" (lấy đúng chữ ở thẻ truyện)
  if (sp.nhan !== "") {
    var elNhan = sp.conHang ? $("ctSapPhatHanh") : $("ctHetHang");
    elNhan.textContent = sp.nhan;
    elNhan.style.display = "block";
  }
  if (!sp.conHang) {
    $("btnThem").disabled = true;
    $("btnThem").textContent = "HẾT HÀNG";
  }
}

// ===== 5. CHỌN SỐ LƯỢNG =====
function laySoLuong() {
  var n = parseInt($("soLuong").value, 10);
  if (isNaN(n) || n < 1) { n = 1; }
  if (n > 99) { n = 99; }
  return n;
}
$("btnGiam").onclick = function () { $("soLuong").value = Math.max(1, laySoLuong() - 1); };
$("btnTang").onclick = function () { $("soLuong").value = Math.min(99, laySoLuong() + 1); };
$("soLuong").onblur  = function () { this.value = laySoLuong(); };

// ===== 6. NÚT THÊM VÀO GIỎ HÀNG =====
$("btnThem").onclick = function () {
  if (!sp || !sp.conHang) { return; }
  var soLuong = laySoLuong();
  var gh = layGioHang();

  // Nếu sản phẩm đã có trong giỏ thì cộng dồn số lượng
  var daCo = false;
  for (var k = 0; k < gh.length; k++) {
    if (gh[k].id === maSP) {
      gh[k].soLuong = Math.min(99, gh[k].soLuong + soLuong);
      daCo = true;
    }
  }
  if (!daCo) {
    gh.push({ id: maSP, ten: sp.ten, anh: sp.anh, gia: sp.gia, giaGoc: sp.giaGoc, soLuong: soLuong });
  }

  localStorage.setItem("gioHang", JSON.stringify(gh));
  capNhatSoLuongGio();
  hienThongBao("✔ Đã thêm " + soLuong + " cuốn vào giỏ hàng");
};

// ===== 7. KHI MỞ TRANG =====
capNhatSoLuongGio();

// ===== 8. ĐÃ ĐĂNG NHẬP THÌ HIỆN TÊN KHÁCH HÀNG TRÊN HEADER =====
var userLink = document.getElementById("userLink");
var dn = localStorage.getItem("dangNhap") || sessionStorage.getItem("dangNhap");
if (userLink && dn) {
  var tt = JSON.parse(dn);
  userLink.title = "Xin chào, " + tt.hoTen + " (bấm để đăng xuất)";
  userLink.textContent = "👤 ";                          // icon
  var tenHienThi = document.createElement("span");        // thêm tên khách hàng
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