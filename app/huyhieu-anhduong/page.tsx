import type { Metadata } from "next";

import App from "../../src/App";
import { chuRe, coDau } from "../../src/Constant";

export const metadata: Metadata = {
  title: `Thiệp nhà trai – ${chuRe.ten} & ${coDau.ten}`,
  description: `Trân trọng kính mời bạn đến dự ngày trọng đại của ${chuRe.ten} và ${coDau.ten}.`,
};

interface PageProps {
  searchParams: Promise<{ to?: string | string[]; guest?: string | string[] }>;
}

export default async function NhaTraiPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const guest = params.to ?? params.guest;
  const guestName = (Array.isArray(guest) ? guest[0] : guest)?.trim() || undefined;

  return <App side="nha-trai" guestName={guestName} />;
}
