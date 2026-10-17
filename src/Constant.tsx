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
  diaDiem: "Tại nhà gái: 88 Mạc Đĩnh Chi, Lê Thanh Nghị, Hải Phòng",
};

export const leVuQuy = {
  thoiGian: "7h00 – 8h30",
  diaDiem: "Tại nhà gái: 88 Mạc Đĩnh Chi, Lê Thanh Nghị, Hải Phòng",
};

export const leThanhHon = {
  thoiGian: "10h – 11h30",
  diaDiem: "Tại nhà trai: 11 ngõ 4 Lam Sơn, Vĩnh Yên, Phú Thọ",
};

export const tiecCuoi = {
  thoiGian: "11h30",
  diaDiem: "Tại nhà trai: 11 ngõ 4 Lam Sơn, Vĩnh Yên, Phú Thọ",
};

export const leCuoi = {
  ngayDuongLich: "12/12/2026",
  ngayAmLich: "Tức 4/11 năm Bính Ngọ",
  leVuQuy,
  leThanhHon,
  tiecCuoi,
};

export const lichTrinhLeCuoi = [
  { thoiGian: "5h00", suKien: "Khởi hành đi đón dâu" },
  { thoiGian: "7h00", suKien: "Đón khách tại nhà gái" },
  { thoiGian: "7h30", suKien: "Lễ Vu Quy tại nhà gái" },
  { thoiGian: "8h20", suKien: "Nhà trai đón dâu" },
  { thoiGian: "10h00", suKien: "Đón khách tại nhà trai" },
  { thoiGian: "11h00", suKien: "Lễ Thành Hôn" },
  { thoiGian: "11h30", suKien: "Khai tiệc" },
  { thoiGian: "10h00-16h00", suKien: "Chụp photobooth" },
];

// ===== Dữ liệu dùng cho các thẻ "Ngày trọng đại" =====
export interface SuKienCard {
  id: string;
  ten: string;
  ngay: string;
  ngayAm: string;
  thoiGian: string;
  diaDiem: string; // hiển thị
  diaChi: string; // dùng cho Google Map
  anh: string;
}

const diaChiNhaGai = "88 Mạc Đĩnh Chi, Lê Thanh Nghị, Hải Phòng";
const diaChiNhaTrai = "11 ngõ 4 Lam Sơn, Vĩnh Yên, Phú Thọ";

export const danhSachSuKien: SuKienCard[] = [
  {
    id: "an-hoi",
    ten: "Lễ Ăn Hỏi",
    ngay: leAnHoi.ngayDuongLich,
    ngayAm: leAnHoi.ngayAmLich,
    thoiGian: leAnHoi.thoiGian,
    diaDiem: leAnHoi.diaDiem,
    diaChi: diaChiNhaGai,
    anh: "/couple.jpg",
  },
  {
    id: "vu-quy",
    ten: "Lễ Vu Quy",
    ngay: leCuoi.ngayDuongLich,
    ngayAm: leCuoi.ngayAmLich,
    thoiGian: leVuQuy.thoiGian,
    diaDiem: leVuQuy.diaDiem,
    diaChi: diaChiNhaGai,
    anh: "/couple.jpg",
  },
  {
    id: "thanh-hon",
    ten: "Lễ Thành Hôn",
    ngay: leCuoi.ngayDuongLich,
    ngayAm: leCuoi.ngayAmLich,
    thoiGian: leThanhHon.thoiGian,
    diaDiem: leThanhHon.diaDiem,
    diaChi: diaChiNhaTrai,
    anh: "/couple.jpg",
  },
  {
    id: "tiec-cuoi",
    ten: "Tiệc Cưới",
    ngay: leCuoi.ngayDuongLich,
    ngayAm: leCuoi.ngayAmLich,
    thoiGian: tiecCuoi.thoiGian,
    diaDiem: tiecCuoi.diaDiem,
    diaChi: diaChiNhaTrai,
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
  ten: string;
  bietDanh?: string;
  noiDung: string;
  thoiGian: string; // ISO string
}

export const loiNhanMau: LoiNhan[] = [
  {
    id: "w1",
    ten: "Minh Anh",
    bietDanh: "Bạn thân cô dâu",
    noiDung: "Chúc hai bạn trăm năm hạnh phúc, mãi yêu thương và nắm tay nhau thật lâu nhé!",
    thoiGian: "2026-10-08T20:15:00+07:00",
  },
  {
    id: "w2",
    ten: "Quang Huy",
    bietDanh: "Đồng nghiệp chú rể",
    noiDung: "Chúc mừng ông bạn sắp lên xe hoa. Hạnh phúc viên mãn nhé!",
    thoiGian: "2026-10-08T21:40:00+07:00",
  },
  {
    id: "w3",
    ten: "Thu Hà",
    bietDanh: "Dì Hà",
    noiDung: "Dì chúc hai con luôn hạnh phúc, sớm có tin vui. Hẹn gặp hai con ngày cưới!",
    thoiGian: "2026-10-09T06:05:00+07:00",
  },
  {
    id: "w4",
    ten: "Đức Mạnh",
    noiDung: "Chúc cô dâu chú rể trăm năm hạnh phúc!",
    thoiGian: "2026-10-09T07:10:00+07:00",
  },
];

export const loiCamOn =
  "Cảm ơn bạn đã dành thời gian đọc thiệp và chia sẻ niềm vui cùng chúng mình. " +
  "Sự có mặt và lời chúc của bạn là món quà quý giá nhất, giúp ngày trọng đại của chúng mình thêm trọn vẹn.";