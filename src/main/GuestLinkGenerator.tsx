"use client";

import { FC, ReactElement, useMemo, useState } from "react";

import { INVITATION_PATHS, SIDE_LABEL, type InvitationSide } from "../types/invitation";

/**
 * Công cụ tạo link thiệp cá nhân hoá (`?to=Tên khách`) encode đúng chuẩn.
 * Tránh việc gõ tay tên tiếng Việt vào link bị lỗi dấu (mojibake, encode 2 lần...).
 */
const GuestLinkGenerator: FC = (): ReactElement => {
  const [guestName, setGuestName] = useState<string>("");
  const [side, setSide] = useState<InvitationSide>("nha-trai");
  const [copied, setCopied] = useState<boolean>(false);

  const trimmed = guestName.trim();
  const link = useMemo(() => {
    if (!trimmed) return "";
    const origin = typeof window === "undefined" ? "" : window.location.origin;
    return `${origin}${INVITATION_PATHS[side]}?to=${encodeURIComponent(trimmed)}`;
  }, [side, trimmed]);

  const handleCopy = async (): Promise<void> => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Trình duyệt cũ không có clipboard API – chọn thủ công
      const input = document.getElementById("generated-guest-link") as HTMLInputElement | null;
      input?.select();
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid rgba(217, 196, 138, 0.5)",
    borderRadius: 8,
    background: "rgba(255, 250, 243, 0.06)",
    color: "inherit",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
  } as const;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        padding: "18px 20px",
        border: "1px solid rgba(217, 196, 138, 0.35)",
        borderRadius: 12,
        background: "rgba(255, 250, 243, 0.06)",
        textAlign: "left",
      }}
    >
      <strong style={{ display: "block", fontSize: 16, marginBottom: 12 }}>
        Tạo link mời khách
      </strong>

      <label style={{ display: "block", fontSize: 13, color: "#e9dfc8", marginBottom: 6 }}>
        Tên khách được kính mời
      </label>
      <input
        type="text"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="Ví dụ: Em Hải Anh"
        style={inputStyle}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {(Object.keys(SIDE_LABEL) as InvitationSide[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSide(key)}
            style={{
              flex: 1,
              padding: "8px 0",
              border: `1px solid ${side === key ? "#d9c48a" : "rgba(217, 196, 138, 0.4)"}`,
              borderRadius: 8,
              background: side === key ? "rgba(217, 196, 138, 0.18)" : "transparent",
              color: side === key ? "#d9c48a" : "#e9dfc8",
              fontSize: 14,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {SIDE_LABEL[key]}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          id="generated-guest-link"
          type="text"
          readOnly
          value={link}
          placeholder="Link sẽ hiện ở đây sau khi nhập tên"
          style={{ ...inputStyle, fontSize: 13, color: "#d9c48a" }}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          type="button"
          onClick={handleCopy}
          disabled={!link}
          style={{
            padding: "0 16px",
            border: "1px solid rgba(217, 196, 138, 0.5)",
            borderRadius: 8,
            background: link ? "rgba(217, 196, 138, 0.18)" : "transparent",
            color: link ? "#d9c48a" : "rgba(233, 223, 200, 0.4)",
            fontSize: 14,
            fontFamily: "inherit",
            cursor: link ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "Đã copy ✓" : "Copy"}
        </button>
      </div>

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", marginTop: 10, fontSize: 13, color: "#e9dfc8" }}
        >
          Mở thử thiệp ↗
        </a>
      )}
    </div>
  );
};

export default GuestLinkGenerator;
