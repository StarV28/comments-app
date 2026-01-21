import { useApi } from "@/composable/useApi";
import { defineStore } from "pinia";
import type {
  CommentsResponse,
  Comment,
  Replies,
  CommentsWs,
} from "../../types/comments.type";
//-------------------------------------------------------------------------------------//

export const useCommentsStore = defineStore("commentStore", () => {
  //---------------------------------------//
  const api = useApi();
  const comments = ref<Comment[]>([]);
  const total = ref(0);
  const totalPages = ref(0);
  const currentPage = ref(1);
  const limit = ref(25);

  const sortBy = ref<"createdAt" | "username" | "email">("createdAt");
  const order = ref<"asc" | "desc">("desc");
  const loading = ref<boolean>(false);

  const currentAnswer = ref<{ parentId: number; parentName: string } | null>(
    null,
  );
  const token = useCookie("token");
  const baseUrl = "http://localhost:3000/api";

  const replies = reactive(new Map<number, Replies[]>());
  const showReplies = reactive<Record<number, boolean>>({});

  //---------------------------------------//
  function toggleReplies(id: number) {
    showReplies[id] = !showReplies[id];
  }

  function setShowReplies(id: number, value: boolean) {
    showReplies[id] = value;
  }
  //---------------------------------------//
  function setCurrentAnswer(parentId: number, parentName: string) {
    currentAnswer.value = { parentId, parentName };
  }

  function clearCurrentAnswer() {
    currentAnswer.value = null;
  }
  //---------------------------------------//
  async function createComments(formData: FormData) {
    loading.value = true;
    try {
      await fetch(`${baseUrl}/comments`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token.value ? `Bearer ${token.value}` : "",
        },
      });
    } catch (err) {
      console.error("Error fetching comments", (err as Error)?.message);
      return null;
    } finally {
      loading.value = false;
    }
  }
  //---------------------------------------//
  async function fetchComments() {
    loading.value = true;
    try {
      const data = await api.get<CommentsResponse>(
        "/comments",
        {
          params: {
            page: currentPage.value,
            sortBy: sortBy.value,
            order: order.value,
          },
        },
        true,
      );
      if (!data) return;
      if (data) {
        comments.value = data.comments;
        total.value = data.pagination.total;
        totalPages.value = data.pagination.totalPages;
        limit.value = data.pagination.limit;
      }
    } catch (err) {
      console.error("Error fetching comments", (err as Error)?.message);
      return null;
    } finally {
      loading.value = false;
    }
  }
  //---------------------------------------//
  async function getReplies(parentId: number): Promise<Replies[]> {
    try {
      const data = await api.get<{ replies: Replies[] }>(
        `/comments/${parentId}/replies`,
      );
      if (!replies.has(parentId)) {
        replies.set(parentId, reactive(data?.replies ?? []));
      } else {
        const arr = replies.get(parentId)!;
        arr.splice(0, arr.length, ...(data?.replies ?? []));
      }
      return replies.get(parentId) ?? [];
    } catch (err) {
      console.error("Error fetching replies comments", (err as Error)?.message);
      return [];
    }
  }
  //---------------------------------------//
  async function deleteComment(
    id: number,
    parentId: number | null,
    fileId: number | null,
  ) {
    try {
      const url = fileId
        ? `/comments/${id}/${parentId}/${fileId}`
        : `/comments/${id}/${parentId}`;
      await api.del<{ success: boolean }>(url, {}, false);
    } catch (err) {
      console.error("Error delete comments", (err as Error)?.message);
    }
  }
  //---------------------------------------//

  function applyWsMessage(msg: CommentsWs) {
    if (msg.type === "comment") {
      total.value += 1;
      totalPages.value = Math.ceil(total.value / limit.value);

      if (currentPage.value === 1) {
        const exists = comments.value.some((c) => c.id === msg.payload.id);
        if (!exists) {
          comments.value.unshift({
            ...msg.payload,
            _count: msg.payload._count ?? { replies: 0 },
            files: msg.payload.files ?? null,
          });
          if (comments.value.length > limit.value) {
            comments.value.pop();
          }
        }
      }
    }

    if (msg.type === "replies") {
      const parentId = msg.payload.parentId;
      if (typeof parentId !== "number") return;

      let arr = replies.get(parentId);

      if (!arr) {
        arr = reactive<Replies[]>([]);
        replies.set(parentId, arr);
      }

      const exists = arr.some((r) => r.id === msg.payload.id);
      if (!exists) {
        arr.push({
          ...msg.payload,
          _count: { replies: 0 },
        } as Replies);
        if (!showReplies[parentId]) {
          setShowReplies(parentId, true);
        }
      }
    }

    if (msg.type === "delete") {
      const parentId = msg.payload.parentId;
      fetchComments();
      if (typeof parentId !== "number") return;
      getReplies(parentId);
    }
  }

  //---------------------------------------//
  function setPage(page: number) {
    currentPage.value = page;
    fetchComments();
  }
  //---------------------------------------//
  function setSort(field: "createdAt" | "username" | "email") {
    if (sortBy.value === field) {
      order.value = order.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = field;
      order.value = "asc";
    }
    fetchComments();
  }

  return {
    loading,
    comments,
    replies,
    total,
    currentPage,
    totalPages,
    limit,

    fetchComments,
    setPage,
    setSort,
    getReplies,
    createComments,
    deleteComment,

    currentAnswer,
    setCurrentAnswer,
    clearCurrentAnswer,
    applyWsMessage,
    toggleReplies,
    setShowReplies,
    showReplies,
  };
});
