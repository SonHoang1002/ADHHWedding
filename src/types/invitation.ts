export type InvitationSide = "nha-trai" | "nha-gai";

export interface InvitationPageProps {
  /** Nhà trai hay nhà gái – quyết định đường dẫn và một số nội dung hiển thị. */
  side: InvitationSide;
  /** Tên khách mời lấy từ query `?to=...`; chỉ hiện dòng "TRÂN TRỌNG KÍNH MỜI" kèm tên khi có tên */
  guestName?: string;
}

export const INVITATION_PATHS: Record<InvitationSide, string> = {
  "nha-trai": "/huyhieu-anhduong",
  "nha-gai": "/anhduong-huyhieu",
};

export const SIDE_LABEL: Record<InvitationSide, string> = {
  "nha-trai": "Nhà trai",
  "nha-gai": "Nhà gái",
};
