export type InvitationSide = "nha-trai" | "nha-gai";

export interface InvitationPageProps {
  /** Nhà trai hay nhà gái – quyết định đường dẫn và một số nội dung hiển thị. */
  side: InvitationSide;
  /** Tên khách mời lấy từ query `?to=...`, hiển thị ở màn mở đầu thiệp. */
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
