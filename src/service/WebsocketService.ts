import { useEffect, useRef } from "react";
import { BASE_WEBSOCKET_URL } from "../constants/config";
import { Message } from "../types/message";

interface WebSocketHandlers {
  onNewMessage: (message: Message) => void;
  onUpdateMessage: (message: Message | Message[]) => void;
  onDeleteMessage: (messageId: number) => void;
}

export function useWebSocket({ onNewMessage, onUpdateMessage, onDeleteMessage }: WebSocketHandlers) {
  const refWebSocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(BASE_WEBSOCKET_URL);
    refWebSocket.current = ws;

    ws.onopen = () => {
      console.log("🟢 Đã kết nối WebSocket thành công!");
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === "new_message") {
          onNewMessage(payload.data);
        } else if (payload.type === "update_message") {
          const data = payload.data;
          if (Array.isArray(data) && data.length === 0) {
            return;
          }
          if (data && typeof data === "object" && "id" in data && !("sender_name" in data) && !("content" in data)) {
            onDeleteMessage(data.id);
          } else {
            onUpdateMessage(data);
          }
        } else if (payload.type === "delete_message") {
          const id = payload.data?.id ?? payload.data;
          if (id !== undefined) {
            onDeleteMessage(id);
          }
        } else {
          console.error("Web socket invalid type");
        }
      } catch (err) {
        console.error("Lỗi khi parse dữ liệu WebSocket:", err);
      }
    };

    ws.onclose = () => {
      console.log("🔴 Mất kết nối WebSocket.");
    };

    return () => {
      ws.close();
    };
  }, [onNewMessage, onUpdateMessage, onDeleteMessage]);
}





