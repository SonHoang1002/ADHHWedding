import type { Metadata } from "next";
import Link from "next/link";

import { chuRe, coDau } from "../src/Constant";
import { INVITATION_PATHS } from "../src/types/invitation";

export const metadata: Metadata = {
  title: "Thiệp cưới – Huy Hiếu & Ánh Dương",
};

export default function HomePage() {
  const links = [
    {
      href: INVITATION_PATHS["nha-trai"],
      title: "Thiệp nhà trai",
      subtitle: `${chuRe.ten} & ${coDau.ten}`,
      note: "Dành cho khách mời của gia đình chú rể",
    },
    {
      href: INVITATION_PATHS["nha-gai"],
      title: "Thiệp nhà gái",
      subtitle: `${coDau.ten} & ${chuRe.ten}`,
      note: "Dành cho khách mời của gia đình cô dâu",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "40px 20px",
        background: "linear-gradient(135deg, #6e1a20, #380a0e)",
        color: "#f4efe6",
        fontFamily: "'Lora', Georgia, serif",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 500, margin: 0, textAlign: "center" }}>
        Huy Hiếu &amp; Ánh Dương
      </h1>
      <p style={{ margin: 0, color: "#e9dfc8", textAlign: "center" }}>
        Chọn thiệp bạn muốn xem
      </p>
      <div
        style={{
          display: "grid",
          gap: 16,
          width: "100%",
          maxWidth: 420,
        }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "block",
              padding: "18px 20px",
              border: "1px solid rgba(217, 196, 138, 0.5)",
              borderRadius: 12,
              background: "rgba(255, 250, 243, 0.06)",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <strong style={{ display: "block", fontSize: 18 }}>{link.title}</strong>
            <span style={{ display: "block", marginTop: 4, color: "#d9c48a" }}>{link.subtitle}</span>
            <span style={{ display: "block", marginTop: 8, fontSize: 14, color: "#e9dfc8" }}>
              {link.note}
            </span>
          </Link>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "rgba(233, 223, 200, 0.7)", textAlign: "center" }}>
        Thêm <code>?to=Tên khách</code> vào cuối đường dẫn để cá nhân hoá lời mời.
      </p>
    </main>
  );
}
