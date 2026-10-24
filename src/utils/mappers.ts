import { Message, Wish } from "../types/message";

export const mapMessageToWish = (msg: Message): Wish => ({
  id: String(msg.id),
  sender_name: msg.sender_name,
  content: msg.content,
  time: msg.created_at,
});

export const mapMessagesToWishes = (messages: Message[]): Wish[] =>
  messages.map(mapMessageToWish);
