export interface SuKienCard {
  id: string;
  ten: string;
  ngay: string;
  ngayAm: string;
  thoiGian: string;
  diaDiem: string;
  diaChi: string;
  anh: string;
}

export interface LoiNhan {
  id: string;
  sender_name: string;
  content: string;
  time: string;
}

export interface RsvpData {
  sender_name: string;
  content: string;
  will_attend: "co" | "khong";
  number_attend: number;
  guest_of: "chu-re" | "co-dau";
}
