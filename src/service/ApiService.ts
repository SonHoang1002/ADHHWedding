import { BASE_API_URL } from "../constants/config";
import { ApiResponse } from "../types/api";
import { Message } from "../types/message";
import { RsvpData } from "../types/wedding";

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
  const payload = {
    sender_name: data.sender_name,
    content: data.content,
    will_attend: data.will_attend,
    guest_of: data.guest_of,
    number_attend: data.number_attend,
  };

  const response = await fetch(`${BASE_API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Message> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Không thể gửi lời nhắn");
  }

  return result.data;
}

export async function updateMessage(
  id: number,
  data: Partial<RsvpData> & { sender_name?: string; content?: string }
): Promise<Message | Message[]> {
  const payload: any = {};
  if (data.sender_name !== undefined) payload.sender_name = data.sender_name;
  if (data.content !== undefined) payload.content = data.content;
  if (data.will_attend !== undefined) payload.will_attend = data.will_attend;
  if (data.guest_of !== undefined) payload.guest_of = data.guest_of;
  if (data.number_attend !== undefined) payload.number_attend = data.number_attend;

  const response = await fetch(`${BASE_API_URL}/messages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<Message | Message[]> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Không thể cập nhật lời nhắn");
  }

  return result.data;
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





























