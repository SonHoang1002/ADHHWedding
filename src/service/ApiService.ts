import { BASE_API_URL } from "../constants/config";
import type { ApiResponse } from "../types/api";
import type { CreateMessagePayload, GuestOf, Message } from "../types/message";
import type { RsvpData } from "../Constant";

// Backend lưu `will_attend` dạng boolean và `guest_of` dạng nhãn hiển thị,
// trong khi form dùng "co"/"khong" và "chu-re"/"co-dau". Quy đổi tại đây
// để payload gửi lên khớp với kiểu dữ liệu của database.
function toWillAttend(value: RsvpData["will_attend"]): boolean {
  return value === "co";
}

function toGuestOf(value: RsvpData["guest_of"]): GuestOf {
  return value === "co-dau" ? "Cô dâu" : "Chú rể";
}

interface ApiErrorOptions {
  status: number;
  method: string;
  url: string;
  requestBody?: string;
  responseBody?: string;
}

/** Lỗi API kèm thông tin request/response để hiển thị chi tiết cho người dùng. */
export class ApiError extends Error {
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly requestBody?: string;
  readonly responseBody?: string;

  constructor(message: string, options: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.method = options.method;
    this.url = options.url;
    this.requestBody = options.requestBody;
    this.responseBody = options.responseBody;
  }
}

interface MessageRequestOptions {
  method: "POST" | "PUT";
  url: string;
  body: unknown;
}

/** Gửi request tạo/cập nhật lời nhắn và ném lỗi chi tiết khi thất bại. */
async function sendMessageRequest<T>({
  method,
  url,
  body,
}: MessageRequestOptions): Promise<T> {
  const requestBody = JSON.stringify(body);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
  } catch (err) {
    throw new ApiError("Không thể kết nối tới server", {
      status: 0,
      method,
      url,
      requestBody, 
      responseBody: err instanceof Error ? err.message : String(err),
    });
  }

  const responseBody = await response.text();

  let result: ApiResponse<T>;
  try {
    result = JSON.parse(responseBody) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      response.ok
        ? "Server trả về dữ liệu không hợp lệ"
        : `Yêu cầu thất bại (HTTP ${response.status})`,
      { status: response.status, method, url, requestBody, responseBody }
    );
  }

  if (!response.ok || !result.success || result.data === undefined || result.data === null) {
    throw new ApiError(
      result.error || `Yêu cầu thất bại (HTTP ${response.status})`,
      { status: response.status, method, url, requestBody, responseBody }
    );
  }

  return result.data;
}

export async function getMessage(before?: string): Promise<Message[]> {
  let url = `${BASE_API_URL}/messages/`;

  if (before) {
    url += `?before=${encodeURIComponent(before)}`;
  }

  const response = await fetch(url);
  const result: ApiResponse<Message[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Không thể tải danh sách tin nhắn");
  }

  return result.data;
}

export async function createMessage(data: RsvpData): Promise<Message> {
  // Payload gửi backend đúng định dạng:
  // { sender_name, content, will_attend: boolean, guest_of: "Chú rể" | "Cô dâu", number_attend }
  const payload: CreateMessagePayload = {
    sender_name: data.sender_name,
    content: data.content,
    will_attend: toWillAttend(data.will_attend),
    guest_of: toGuestOf(data.guest_of),
    number_attend: data.number_attend,
  };

  return sendMessageRequest<Message>({
    method: "POST",
    url: `${BASE_API_URL}/messages`,
    body: payload,
  });
}

export async function updateMessage(
  id: number,
  data: Partial<RsvpData> & { sender_name?: string; content?: string }
): Promise<Message | Message[]> {
  const payload: Partial<CreateMessagePayload> = {};
  if (data.sender_name !== undefined) payload.sender_name = data.sender_name;
  if (data.content !== undefined) payload.content = data.content;
  if (data.will_attend !== undefined) payload.will_attend = toWillAttend(data.will_attend);
  if (data.guest_of !== undefined) payload.guest_of = toGuestOf(data.guest_of);
  if (data.number_attend !== undefined) payload.number_attend = data.number_attend;

  return sendMessageRequest<Message | Message[]>({
    method: "PUT",
    url: `${BASE_API_URL}/messages/${id}`,
    body: payload,
  });
}

export async function deleteMessage(id: number): Promise<any> {
  const response = await fetch(`${BASE_API_URL}/messages/${id}`, {
    method: "DELETE",
  });

  const result: ApiResponse<any> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Không thể xóa lời nhắn");
  }

  return result.data;
}

export async function deleteAllMessage(): Promise<any> {
  const response = await fetch(`${BASE_API_URL}/messages`, {
    method: "DELETE",
  });

  const result: ApiResponse<any> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Không thể xóa tất cả lời nhắn");
  }

  return result.data;
}





























