import { FC, ReactElement, useCallback, useEffect, useRef, useState } from "react";

import WeddingInvite from "./main/WeddingInvite";
import { Message } from "./types/message";
import { Wish } from "./types/message";
import { createMessage, getMessage } from "./service/ApiService";
import { useWebSocket } from "./service/WebsocketService";
import { mapMessageToWish } from "./utils/mappers";

const App: FC = (): ReactElement => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const messagesRef = useRef<Message[]>([]);

  const loadInitialWishes = useCallback(async () => {
    try {
      const messages = await getMessage();
      messagesRef.current = messages;
      setWishes(messages.map(mapMessageToWish));
      setHasMore(messages.length >= 20);
    } catch (error) {
      console.error("Không thể tải danh sách lời nhắn:", error);
    }
  }, []);

  const loadMoreWishes = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    const oldest = messagesRef.current[messagesRef.current.length - 1];
    if (!oldest) return;

    setLoadingMore(true);
    try {
      const messages = await getMessage(oldest.created_at);
      if (messages.length === 0) {
        setHasMore(false);
        return;
      }
      messagesRef.current = [...messagesRef.current, ...messages];
      setWishes((prev) => [...prev, ...messages.map(mapMessageToWish)]);
      setHasMore(messages.length >= 20);
    } catch (error) {
      console.error("Không thể tải thêm lời nhắn:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore]);

  useEffect(() => {
    loadInitialWishes();
  }, [loadInitialWishes]);

  const handleNewMessage = useCallback((message: Message) => {
    messagesRef.current = [message, ...messagesRef.current];
    setWishes((prev) => [mapMessageToWish(message), ...prev]);
  }, []);

  const handleUpdateMessage = useCallback((message: Message | Message[]) => {
    const updated = Array.isArray(message) ? message[0] : message;
    if (!updated) return;
    messagesRef.current = messagesRef.current.map((m) => (m.id === updated.id ? updated : m));
    setWishes((prev) =>
      prev.map((w) => (w.id === String(updated.id) ? mapMessageToWish(updated) : w))
    );
  }, []);

  const handleDeleteMessage = useCallback((messageId: number) => {
    messagesRef.current = messagesRef.current.filter((m) => m.id !== messageId);
    setWishes((prev) => prev.filter((w) => w.id !== String(messageId)));
  }, []);

  useWebSocket({
    onNewMessage: handleNewMessage,
    onUpdateMessage: handleUpdateMessage,
    onDeleteMessage: handleDeleteMessage,
  });

  const handleSubmitRsvp = async (data: any) => {
    try {
      await createMessage(data);
    } catch (error) {
      console.error("Không thể gửi lời nhắn:", error);
      throw error;
    }
  };

  return (
    <WeddingInvite
      onSubmitRsvp={handleSubmitRsvp}
      wishes={wishes}
      onLoadMoreWishes={loadMoreWishes}
      hasMoreWishes={hasMore}
      loadingMoreWishes={loadingMore}
    />
  );
};

export default App;
