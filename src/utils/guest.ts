/**
 * Chuẩn hoá tên khách mời lấy từ query `?to=...`.
 *
 * Link chia sẻ có thể bị lỗi encode theo nhiều kiểu tuỳ vào nơi tạo link
 * (gõ tay, QR code, tin nhắn, công cụ rút gọn...). Hàm này cố gắng phục hồi
 * về text tiếng Việt đúng trước khi đưa vào thiệp:
 *
 * 1. Encode 2 lần: `H%25E1%25BA%25A3i` – sau khi server decode 1 lần vẫn
 *    còn sót `H%E1%BA%A3i` → decode thêm một lần nữa.
 * 2. Mojibake: UTF-8 bị đọc nhầm thành latin-1 (`Háº£i`) → đọc lại từ latin-1.
 * 3. Unicode tách rời (NFD, thường do copy từ macOS/iOS): `Hải` → gộp NFC `Hải`.
 *
 * Link encode đúng chuẩn (`?to=Em%20H%E1%BA%A3i%20Anh`) đi qua nguyên vẹn.
 */

/** Query `to` thô nhận từ searchParams của trang */
export type RawGuestParam = string | string[] | undefined;

const DOUBLE_ENCODED = /%[0-9A-Fa-f]{2}/;

/** Dấu hiệu UTF-8 bị đọc nhầm thành latin-1: "Ã…" / "Â…" / "áº…" / "á»…" / ký tự điều khiển C1 */
const MOJIBAKE = /[\u00C2\u00C3].|[\u00E0-\u00E1][\u00BA\u00BB]|[\u0080-\u009F]/;

/** Đọc lại chuỗi như từng là byte latin-1 rồi decode UTF-8 (chạy được cả client, không cần Buffer). */
const fromLatin1Bytes = (value: string): string => {
  const bytes = new Uint8Array(value.length);
  for (let i = 0; i < value.length; i += 1) bytes[i] = value.charCodeAt(i) & 0xff;
  return new TextDecoder().decode(bytes); // lỗi sequence → ký tự thay thế U+FFFD
};

export const normalizeGuestName = (raw: RawGuestParam): string | undefined => {
  let name = (Array.isArray(raw) ? raw[0] : raw)?.trim();
  if (!name) return undefined;

  // 1) Link bị percent-encode 2 lần
  if (DOUBLE_ENCODED.test(name)) {
    try {
      name = decodeURIComponent(name);
    } catch {
      /* chuỗi % không hợp lệ → giữ nguyên như tên người dùng gõ */
    }
  }

  // 2) Mojibake – chỉ nhận kết quả decode ra hợp lệ (không có ký tự thay thế)
  if (MOJIBAKE.test(name)) {
    const fixed = fromLatin1Bytes(name);
    // U+FFFD là ký tự thay thế – nếu có nghĩa là decode thất bại
    if (!fixed.includes("�")) name = fixed;
  }

  // 3) Gộp ký tự tách rời lại (NFC) rồi trim
  return name.normalize("NFC").trim() || undefined;
};
