export type GuestOf = "Chú rể" | "Cô dâu";

export interface CreateMessagePayload {
  sender_name: string;
  content: string;
  will_attend: boolean;
  guest_of: GuestOf;
  number_attend: number;
}

export interface Message {
  id: number;
  sender_name: string;
  content: string;
  will_attend: boolean | null;
  guest_of: string | null;
  number_attend: number | null;
  created_at: string;
}

export interface Wish {
  id: string;
  sender_name: string;
  content: string;
  time: string;
}
