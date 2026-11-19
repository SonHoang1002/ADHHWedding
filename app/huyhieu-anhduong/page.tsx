import type { Metadata } from "next";

import App from "../../src/App";
import { chuRe, coDau } from "../../src/Constant";
import { normalizeGuestName } from "../../src/utils/guest";

export const metadata: Metadata = {
  title: `Thiệp nhà trai – ${chuRe.ten} & ${coDau.ten}`,
  description: `Trân trọng kính mời bạn đến dự ngày trọng đại của ${chuRe.ten} và ${coDau.ten}.`,
};

interface PageProps {
  searchParams: Promise<{ to?: string | string[] }>;
}

export default async function NhaTraiPage({ searchParams }: PageProps) {
  const params = await searchParams;
  // Chỉ hiển thị người được kính mời khi đường dẫn có ?to=... (tự sửa link bị lỗi encode)
  const guestName = normalizeGuestName(params.to);

  return <App side="nha-trai" guestName={guestName} />;
}
