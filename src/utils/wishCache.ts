import type { Message } from "../types/message";

/**
 * Cache một số lời nhắn mới nhất ở localStorage.
 * Dùng khi không gọi được API/WebSocket lời chúc (backend tắt, mất mạng...),
 * thiệp vẫn hiển thị được lời nhắn của lần tải trước thay vì danh sách trống.
 */
const WISH_CACHE_KEY = "adhh-wedding:wishes:v1";

/** Giữ tối đa 20 lời nhắn mới nhất để không làm phình localStorage. */
export const WISH_CACHE_LIMIT = 20;

function isValidMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;

  const message = value as Partial<Message>;
  return (
    typeof message.id === "number" &&
    typeof message.sender_name === "string" &&
    typeof message.content === "string" &&
    typeof message.created_at === "string"
  );
}

export function readCachedMessages(): Message[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WISH_CACHE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidMessage).slice(0, WISH_CACHE_LIMIT);
  } catch (error) {
    console.warn("Không đọc được cache lời nhắn:", error);
    return [];
  }
}

export function writeCachedMessages(messages: Message[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      WISH_CACHE_KEY,
      JSON.stringify(messages.slice(0, WISH_CACHE_LIMIT))
    );
  } catch (error) {
    // localStorage đầy hoặc bị chặn (chế độ riêng tư) – không làm hỏng thiệp.
    console.warn("Không lưu được cache lời nhắn:", error);
  }
}
