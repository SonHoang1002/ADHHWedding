export interface Message {
  id: number;
  sender_name: string;
  content: string;
  will_attend: boolean | null;
  guest_of: string | null;
  number_attend: number | null;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}