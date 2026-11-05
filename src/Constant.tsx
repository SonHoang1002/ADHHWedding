

export const BASE_WEBSOCKET_URL = "ws://localhost:3000/ws"
export const BASE_API_URL = "http://localhost:3000/api"

export const ngayChinhThuc = "12 tháng 12, 2026";

// Thời điểm bắt đầu / kết thúc cả ngày cưới (dùng cho Countdown & Save the Date)
export const thoiDiemCuoi = {
  batDau: "2026-12-12T07:00:00+07:00",
  ketThuc: "2026-12-12T13:00:00+07:00",
  gcalBatDau: "20261212T070000",
  gcalKetThuc: "20261212T130000",
  diaChi: "11 ngõ 4 Lam Sơn, Vĩnh Yên, Phú Thọ",
};

export const chuRe = {
  ten: "Huy Hiếu",
  tenDayDu: "Phạm Huy Hiếu",
  bo: "Phạm Huy Luật",
  me: "Dương Thị Hệ",
  queQuan: "Vĩnh Yên, Phú Thọ",
  anh: "/groom.jpg",
};

export const coDau = {
  ten: "Ánh Dương",
  tenDayDu: "Nguyễn Thị Ánh Dương",
  bo: "Nguyễn Trọng Hưng",
  me: "Đặng Thị Thuý Hằng",
  queQuan: "Lê Thanh Nghị, Hải Phòng",
  anh: "/bride.jpg",
};

export const leAnHoi = {
  ngayDuongLich: "29/11/2026",
  ngayAmLich: "Tức 21/10 năm Bính Ngọ",
  thoiGian: "9h00 – 11h00",
  diaDiem: ["Tại nhà gái: 88 Mạc Đĩnh Chi, Lê Thanh Nghị, Hải Phòng"],
};

export const leVuQuy = {
  thoiGian: "7h00 – 8h30",
  diaDiem: ["Tại nhà gái: 88 Mạc Đĩnh Chi, Lê Thanh Nghị, Hải Phòng"],
};

export const leThanhHon = {
  thoiGian: "10h – 11h30",
  diaDiem: ["Tại nhà trai: 11 ngõ 4 Lam Sơn, Vĩnh Yên, Phú Thọ"],
};

export const tiecCuoiNhaGai = {
  ngayDuongLich: "11/12/2026",
  ngayAmLich: "Tức 3/11 năm Bính Ngọ",
  thoiGian: "17h00",
  diaDiem: ["Tại nhà gái: Trung tâm tổ chức sự kiện White Palace Hà Hải"],
};

export const tiecCuoiNhaTrai = {
  ngayDuongLich: "12/12/2026",
  ngayAmLich: "Tức 4/11 năm Bính Ngọ",
  thoiGian: "11h30",
  diaDiem: ["Tại nhà trai: 11 ngõ 4 Lam Sơn, Vĩnh Yên, Phú Thọ"],
};

export const leCuoi = {
  ngayDuongLich: "12/12/2026",
  ngayAmLich: "Tức 4/11 năm Bính Ngọ",
  leVuQuy,
  leThanhHon,
  tiecCuoiNhaGai,
  tiecCuoiNhaTrai,
};

export const lichTrinhLeCuoi = [
  { thoiGian: "4h00", suKien: "Khởi hành đi đón dâu" },
  { thoiGian: "6h30", suKien: "Đón khách tại nhà gái" },
  { thoiGian: "7h", suKien: "Lễ Vu Quy tại nhà gái" },
  { thoiGian: "8h", suKien: "Nhà trai đón dâu" },
  { thoiGian: "9h30", suKien: "Đón khách tại nhà trai" },
  { thoiGian: "10h30", suKien: "Lễ Thành Hôn" },
  { thoiGian: "11h", suKien: "Khai tiệc" },
  { thoiGian: "10h00 \n 16h00", suKien: "Chụp photobooth" },
];

// ===== Dữ liệu dùng cho các thẻ "Ngày trọng đại" =====
// Một điểm trên bản đồ: label hiển thị phía trên ghim (Nhà trai / Nhà gái)
export interface SuKienDiaDiem {
  label: string;
  diaChi: string;
  lat: number;
  lng: number;
}

export interface SuKienCard {
  id: string;
  ten: string;
  ngay: string;
  ngayAm: string;
  thoiGian: string;
  diaDiem: string[]; // hiển thị
  banDo: SuKienDiaDiem[]; // các điểm hiển thị trên cùng một bản đồ
  anh: string;
}

const diaChiNhaGai = "88 Mạc Đĩnh Chi, Lê Thanh Nghị, Hải Phòng";
const diaChiNhaTrai = "11 ngõ 4 Lam Sơn, Vĩnh Yên, Phú Thọ";
const diaChiWhitePalace = "Trung tâm tổ chức sự kiện White Palace Hà Hải";

// Toạ độ lấy từ Google Maps
const diemNhaGai: SuKienDiaDiem = {
  label: "Nhà gái",
  diaChi: diaChiNhaGai,
  lat: 20.928459,
  lng: 106.327541,
};

const diemNhaTrai: SuKienDiaDiem = {
  label: "Nhà trai",
  diaChi: diaChiNhaTrai,
  lat: 21.305631,
  lng: 105.582221,
};

const diemWhitePalace: SuKienDiaDiem = {
  label: "Nhà gái",
  diaChi: diaChiWhitePalace,
  lat: 20.927114,
  lng: 106.328534,
};

export const danhSachSuKien: SuKienCard[] = [
  {
    id: "an-hoi",
    ten: "Lễ Ăn Hỏi",
    ngay: leAnHoi.ngayDuongLich,
    ngayAm: leAnHoi.ngayAmLich,
    thoiGian: leAnHoi.thoiGian,
    diaDiem: leAnHoi.diaDiem,
    banDo: [diemNhaGai],
    anh: "/couple.jpg",
  },
  {
    id: "vu-quy",
    ten: "Lễ Vu Quy",
    ngay: leCuoi.ngayDuongLich,
    ngayAm: leCuoi.ngayAmLich,
    thoiGian: leVuQuy.thoiGian,
    diaDiem: leVuQuy.diaDiem,
    banDo: [diemNhaGai],
    anh: "/couple.jpg",
  },
  {
    id: "thanh-hon",
    ten: "Lễ Thành Hôn",
    ngay: leCuoi.ngayDuongLich,
    ngayAm: leCuoi.ngayAmLich,
    thoiGian: leThanhHon.thoiGian,
    diaDiem: leThanhHon.diaDiem,
    banDo: [diemNhaTrai],
    anh: "/couple.jpg",
  },
  {
    id: "tiec-cuoi-nha-gai",
    ten: "Tiệc Cưới tại Nhà Gái",
    ngay: tiecCuoiNhaGai.ngayDuongLich,
    ngayAm: tiecCuoiNhaGai.ngayAmLich,
    thoiGian: tiecCuoiNhaGai.thoiGian,
    diaDiem: tiecCuoiNhaGai.diaDiem,
    banDo: [diemWhitePalace],
    anh: "/couple.jpg",
  },
  {
    id: "tiec-cuoi-nha-trai",
    ten: "Tiệc Cưới tại Nhà Trai",
    ngay: tiecCuoiNhaTrai.ngayDuongLich,
    ngayAm: tiecCuoiNhaTrai.ngayAmLich,
    thoiGian: tiecCuoiNhaTrai.thoiGian,
    diaDiem: tiecCuoiNhaTrai.diaDiem,
    banDo: [diemNhaTrai],
    anh: "/couple.jpg",
  },
];

// ===== Dresscode =====
export const dresscode = [
  { mau: "#C8A88F", ten: "Nâu be" },
  { mau: "#F9EFE3", ten: "Be nhạt" },
  { mau: "#F3D88D", ten: "Vàng" },
  { mau: "#f4c2c2", ten: "Hồng" },
];

// ===== Lời nhắn mẫu (sau này thay bằng dữ liệu từ WebSocket) =====
export interface LoiNhan {
  id: string;
  sender_name: string;
  content: string;
  time: string; // ISO string
}

export interface RsvpData {
  sender_name: string;
  content: string;
  will_attend: "co" | "khong";
  number_attend: number;
  guest_of: "chu-re" | "co-dau";
}

export const loiNhanMau: LoiNhan[] = [
  {
    id: "w1",
    sender_name: "Minh Anh",
    content: "Chúc hai bạn trăm năm hạnh phúc, mãi yêu thương và nắm tay nhau thật lâu nhé!",
    time: "2026-10-08T20:15:00+07:00",
  },
  {
    id: "w2",
    sender_name: "Quang Huy",
    content: "Chúc mừng ông bạn sắp lên xe hoa. Hạnh phúc viên mãn nhé!",
    time: "2026-10-08T21:40:00+07:00",
  },
  {
    id: "w3",
    sender_name: "Thu Hà",
    content: "Dì chúc hai con luôn hạnh phúc, sớm có tin vui. Hẹn gặp hai con ngày cưới!",
    time: "2026-10-09T06:05:00+07:00",
  },
  {
    id: "w4",
    sender_name: "Đức Mạnh",
    content: "Chúc cô dâu chú rể trăm năm hạnh phúc!",
    time: "2026-10-09T07:10:00+07:00",
  },
];

export const loiCamOn =
  "Cảm ơn bạn đã dành thời gian đọc thiệp và chia sẻ niềm vui cùng chúng mình. " +
  "Sự có mặt và lời chúc của bạn là món quà quý giá nhất, giúp ngày trọng đại của chúng mình thêm trọn vẹn.";