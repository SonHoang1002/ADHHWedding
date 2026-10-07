import {
  chuRe,
  coDau,
  leAnHoi,
  leCuoi,
  lichTrinhLeCuoi,
  ngayChinhThuc,
} from "../Constant";

export interface InviteEvent {
  title: string;
  date: string;
  lunar?: string;
  time: string;
  place: string;
}

export const inviteData = {
  groom: chuRe.ten,
  bride: coDau.ten,
  groomFull: chuRe.tenDayDu,
  brideFull: coDau.tenDayDu,
  groomParents: `ông ${chuRe.bo}, bà ${chuRe.me}`,
  brideParents: `ông ${coDau.bo}, bà ${coDau.me}`,
  groomHome: chuRe.queQuan,
  brideHome: coDau.queQuan,
  date: "12.12.2026",
  dateLong: ngayChinhThuc,
  weekday: "Thứ Bảy",
  lunar: leCuoi.ngayAmLich,
  events: [
    {
      title: "Lễ ăn hỏi",
      date: leAnHoi.ngayDuongLich,
      lunar: leAnHoi.ngayAmLich,
      time: leAnHoi.thoiGian,
      place: leAnHoi.diaDiem,
    },
    {
      title: "Lễ vu quy",
      date: leCuoi.ngayDuongLich,
      time: leCuoi.leVuQuy.thoiGian,
      place: leCuoi.leVuQuy.diaDiem,
    },
    {
      title: "Lễ thành hôn",
      date: leCuoi.ngayDuongLich,
      time: leCuoi.leThanhHon.thoiGian,
      place: leCuoi.leThanhHon.diaDiem,
    },
    {
      title: "Tiệc cưới",
      date: leCuoi.ngayDuongLich,
      time: leCuoi.tiecCuoi.thoiGian,
      place: leCuoi.tiecCuoi.diaDiem,
    },
  ] as InviteEvent[],
  timeline: lichTrinhLeCuoi,
  closing: "Rất hân hạnh được đón tiếp quý khách!",
};
