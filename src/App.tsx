"use client";

import { FC, ReactElement, useCallback, useEffect, useRef, useState } from "react";

import WeddingInvite from "./main/WeddingInvite";
import { Message } from "./types/message";
import { Wish } from "./types/message";
import type { InvitationPageProps } from "./types/invitation";
import { createMessage, getMessage } from "./service/ApiService";
import { useWebSocket } from "./service/WebsocketService";
import { mapMessageToWish } from "./utils/mappers";
import {
  readCachedMessages,
  WISH_CACHE_LIMIT,
  writeCachedMessages,
} from "./utils/wishCache";

const App: FC<InvitationPageProps> = ({ side, guestName }): ReactElement => {
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
      writeCachedMessages(messages);
    } catch (error) {
      // Giữ nguyên lời nhắn đã đọc từ cache (nếu có) để thiệp không bị trống.
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
      const nextMessages = [...messagesRef.current, ...messages];
      messagesRef.current = nextMessages;
      setWishes((prev) => [...prev, ...messages.map(mapMessageToWish)]);
      setHasMore(messages.length >= 20);
      writeCachedMessages(nextMessages);
    } catch (error) {
      console.error("Không thể tải thêm lời nhắn:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore]);

  useEffect(() => {
    // Hiển thị lời nhắn đã cache ngay khi mở thiệp, sau đó mới gọi API làm mới.
    const cached = readCachedMessages();
    if (cached.length > 0) {
      messagesRef.current = cached;
      setWishes(cached.map(mapMessageToWish));
      setHasMore(cached.length >= WISH_CACHE_LIMIT);
    }
    loadInitialWishes();
  }, [loadInitialWishes]);

  const handleNewMessage = useCallback((message: Message) => {
    const nextMessages = [
      message,
      ...messagesRef.current.filter((m) => m.id !== message.id),
    ];
    messagesRef.current = nextMessages;
    setWishes((prev) => [
      mapMessageToWish(message),
      ...prev.filter((w) => w.id !== String(message.id)),
    ]);
    writeCachedMessages(nextMessages);
  }, []);

  const handleUpdateMessage = useCallback((message: Message | Message[]) => {
    const updated = Array.isArray(message) ? message[0] : message;
    if (!updated) return;
    const nextMessages = messagesRef.current.map((m) => (m.id === updated.id ? updated : m));
    messagesRef.current = nextMessages;
    setWishes((prev) =>
      prev.map((w) => (w.id === String(updated.id) ? mapMessageToWish(updated) : w))
    );
    writeCachedMessages(nextMessages);
  }, []);

  const handleDeleteMessage = useCallback((messageId: number) => {
    const nextMessages = messagesRef.current.filter((m) => m.id !== messageId);
    messagesRef.current = nextMessages;
    setWishes((prev) => prev.filter((w) => w.id !== String(messageId)));
    writeCachedMessages(nextMessages);
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
      side={side}
      guestName={guestName}
      onSubmitRsvp={handleSubmitRsvp}
      wishes={wishes}
      onLoadMoreWishes={loadMoreWishes}
      hasMoreWishes={hasMore}
      loadingMoreWishes={loadingMore}
    />
  );
};

export default App;
