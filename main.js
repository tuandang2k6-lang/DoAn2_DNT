// ===== 1. BẬT/TẮT MENU TRÊN ĐIỆN THOẠI =====
var menuBtn = document.getElementById("menuBtn");
var menu = document.getElementById("menu");
menuBtn.onclick = function () {
  menu.classList.toggle("open");
};

// ===== 2. SLIDER BANNER =====
var slides = document.querySelectorAll(".slide");
var current = 0;

function showSlide(n) {
  slides[current].classList.remove("show");
  current = (n + slides.length) % slides.length;
  slides[current].classList.add("show");
}

document.getElementById("nextBtn").onclick = function () { showSlide(current + 1); };
document.getElementById("prevBtn").onclick = function () { showSlide(current - 1); };
setInterval(function () { showSlide(current + 1); }, 2500);   // tự chuyển sau 4 giây

// ===== 3. ẨN ẢNH BỊ LỖI (chưa có file ảnh) =====
var imgs = document.querySelectorAll("img");
for (var i = 0; i < imgs.length; i++) {
  imgs[i].onerror = function () { this.style.display = "none"; };
}

// ===== 4. ĐÃ ĐĂNG NHẬP THÌ BẤM ICON ĐỂ ĐĂNG XUẤT =====
var userLink = document.getElementById("userLink");
var dn = localStorage.getItem("dangNhap") || sessionStorage.getItem("dangNhap");
if (dn) {
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

// ===== 5. THANH TÌM KIẾM TRUYỆN =====
// Bỏ dấu tiếng Việt + chuyển chữ thường để "doremon" vẫn tìm ra "Đôrêmon"
function boDau(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

var searchForm  = document.getElementById("searchForm");
var searchInput = document.getElementById("searchInput");
var noResult    = document.getElementById("noResult");
var allCards    = document.querySelectorAll(".card");
var allSections = document.querySelectorAll("main .container");

function timKiem() {
  var tuKhoa = boDau(searchInput.value.trim());
  var soTim = 0;

  // 1. Ẩn/hiện từng thẻ truyện theo tên
  for (var s = 0; s < allCards.length; s++) {
    var ten = boDau(allCards[s].querySelector("h3").textContent);
    var khop = ten.indexOf(tuKhoa) !== -1;
    allCards[s].style.display = khop ? "" : "none";
    if (khop) { soTim++; }
  }

  // 2. Ẩn cả mục (Pre-order / Manga) nếu không còn truyện nào
  for (var m = 0; m < allSections.length; m++) {
    var cards = allSections[m].querySelectorAll(".card");
    var dem = 0;
    for (var c = 0; c < cards.length; c++) {
      if (cards[c].style.display !== "none") { dem++; }
    }
    allSections[m].style.display = (dem === 0) ? "none" : "";
  }

  // 3. Đang tìm kiếm thì ẩn banner cho gọn
  var dangTim = (tuKhoa !== "");
  document.querySelector(".slider").style.display = dangTim ? "none" : "";
  document.querySelector(".manga-banner").style.display = dangTim ? "none" : "";

  // 4. Thông báo kết quả
  if (!dangTim) {
    noResult.className = "no-result";
    noResult.textContent = "";
  } else if (soTim > 0) {
    noResult.className = "no-result show ok";
    noResult.textContent = "Tìm thấy " + soTim + " truyện cho \"" + searchInput.value.trim() + "\"";
  } else {
    noResult.className = "no-result show";
    noResult.textContent = "Không tìm thấy truyện nào cho \"" + searchInput.value.trim() + "\"";
  }
}

searchInput.oninput = timKiem;                 // vừa gõ vừa lọc
searchForm.onsubmit = function (e) {           // bấm Enter hoặc nút 🔍
  e.preventDefault();
  timKiem();
  noResult.scrollIntoView({ behavior: "smooth" });
};
// ===== 6. BẤM VÀO THẺ TRUYỆN -> SANG TRANG CHI TIẾT =====
// Tạo mã từ tên truyện: "(Tập lẻ) Bluelock 35" -> "tap-le-bluelock-35"
function taoMaSP(ten) {
  return ten.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
// "29.700đ" -> 29700
function layTien(chu) {
  return parseInt(chu.replace(/\D/g, ""), 10) || 0;
}

var dsThe = document.querySelectorAll(".card");
for (var t = 0; t < dsThe.length; t++) {
  dsThe[t].style.cursor = "pointer";
  dsThe[t].onclick = function () {
    // Đọc thông tin ngay trên thẻ truyện mà người dùng vừa bấm
    var ten   = this.querySelector("h3").textContent.trim();
    var anh   = this.querySelector("img");
    var nhan  = this.querySelector(".tag");       // "Sắp phát hành" hoặc "Hết hàng"
    var giam  = this.querySelector(".sale");      // "-10%"
    var giaCu = this.querySelector(".price del"); // giá gốc gạch ngang
    var sp = {
      id: taoMaSP(ten),
      ten: ten,
      anh: anh ? anh.getAttribute("src") : "",
      gia: layTien(this.querySelector(".price").childNodes[0].textContent),
      giaGoc: giaCu ? layTien(giaCu.textContent) : 0,
      giam: giam ? layTien(giam.textContent) : 0,
      nhan: nhan ? nhan.textContent.trim() : "",
      hetHang: nhan ? nhan.classList.contains("gray") : false
    };
    localStorage.setItem("spDangXem", JSON.stringify(sp));   // trang chi tiết sẽ đọc lại
    window.location.href = "chitietsanpham.html?id=" + sp.id;
  };
}

// ===== 7. HIỆN SỐ LƯỢNG GIỎ HÀNG TRÊN ICON 🛒 =====
var badgeGio = document.querySelector('a[title="Giỏ hàng"] .badge');
var gioHang = JSON.parse(localStorage.getItem("gioHang")) || [];
var tongSL = 0;
for (var g = 0; g < gioHang.length; g++) { tongSL += gioHang[g].soLuong; }
if (badgeGio) { badgeGio.textContent = tongSL; }