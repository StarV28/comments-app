import { defineStore } from "pinia";
import type { CommentsWs } from "../../types/comments.type";

//---------------------------------------//
export const useSocketStore = defineStore("socketStore", () => {
  //---------------------------------------//

  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const config = useRuntimeConfig();
  const baseUrl = config.public.wsUrl;
  const data = ref<((msg: CommentsWs) => void)[]>([]);

  //---------------------------------------//
  const connect = () => {
    if (!import.meta.client) return;
    if (!baseUrl) throw new Error("WS base URL is not defined");
    socket.value = new WebSocket(baseUrl);

    socket.value.onopen = () => {
      console.log("🔹 WS connected");
      isConnected.value = true;
    };

    socket.value.onmessage = (ev) => {
      const parsed = JSON.parse(ev.data);
      data.value.forEach((fn) => fn(parsed));
    };

    socket.value.onclose = () => {
      console.log("🔹 WS disconnected, reconnecting in 3s...");
      isConnected.value = false;
      setTimeout(() => connect(), 3000);
    };

    socket.value.onerror = (err) => {
      console.error("WS error:", err);
      socket.value?.close();
    };
  };
  const onMessage = (cb: (msg: CommentsWs) => void) => {
    data.value.push(cb);
  };

  return {
    connect,
    onMessage,
    isConnected,
  };
});
