import { useSocketStore } from "@/stores/socketStore";
import { useCommentsStore } from "@/stores/commentsStore";

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return;
  const socketStore = useSocketStore();
  const commentsStore = useCommentsStore();
  socketStore.connect();

  socketStore.onMessage((msg) => {
    commentsStore.applyWsMessage(msg);
  });
});
