<template>
  <div class="wrapper">
    <div v-if="loading">Loading...</div>
    <div v-for="reply in replies" :key="reply.id" class="comment">
      <div class="comment__title title">
        <div class="title__name">
          <span>User</span>
          <h4>{{ reply.user?.username ?? "Unknown" }}</h4>
        </div>
        <div class="comment__date">
          {{ formatDate(reply.createdAt) }}
        </div>
      </div>
      <div class="comment__message">
        <span v-html="reply.content" />
        <div
          v-if="reply.files && reply.files.type === 'image'"
          class="comment__img"
        >
          <img
            :src="reply.files.url"
            :alt="reply.files.originalName"
            @click="show = true"
          />
          <vue-easy-lightbox
            :visible="show"
            :imgs="[reply.files.url]"
            @hide="show = false"
          />
        </div>
        <div v-else-if="reply.files && reply.files.type === 'txt'">
          <a :href="reply.files.url" target="_blank">
            {{ reply.files.originalName }}
          </a>
        </div>
      </div>
      <div class="comment__box-btn">
        <button @click="onAnswer(reply)">Answer</button>
        <button
          v-if="reply._count?.replies > 0"
          class="reply-toggle"
          @click="commentsStore.toggleReplies(reply.id)"
        >
          {{
            commentsStore.showReplies[reply.id]
              ? "Hide replies"
              : "Show replies"
          }}
        </button>
        <button
          v-if="reply.user.id === user?.id"
          @click="
            onDelete(
              reply.id,
              reply.parentId,
              reply.files ? reply.files.id : null,
            )
          "
        >
          Delete
        </button>
      </div>
      <CommentReplies
        v-if="
          (commentsStore.replies.get(reply.id)?.length ?? 0) > 0 ||
          commentsStore.showReplies[reply.id]
        "
        :parent-id="reply.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommentsStore } from "@/stores/commentsStore";
import type { Replies, User } from "../../../types/comments.type";
import VueEasyLightbox from "vue-easy-lightbox";

//---------------------------------------//
const props = defineProps<{
  parentId: number;
}>();
const show = ref(false);
const commentsStore = useCommentsStore();
const replies = computed(() => {
  return commentsStore.replies.get(props.parentId) ?? [];
});
const loading = ref(false);
const user = await useCookie<User | null>("user");
//---------------------------------------//

function onAnswer(comment: Replies) {
  commentsStore.showReplies[comment.id] = true;
  commentsStore.setCurrentAnswer(
    comment.id,
    comment.user?.username ?? "Unknown",
  );
}
//---------------------------------------//

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

watch(
  () => props.parentId,
  async (id) => {
    if (
      !commentsStore.replies.get(id) ||
      commentsStore.replies.get(id)!.length === 0
    ) {
      await commentsStore.getReplies(id);
    }
  },
  { immediate: true },
);

const onDelete = (id: number, parentId: number, fileId: number | null) => {
  commentsStore.deleteComment(id, parentId, fileId);
};
</script>

<style scoped>
.wrapper {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 15px;
  margin-left: 100px;
}
.comment {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-start;
  gap: 20px;
}
.title {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}
.title__name {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  span {
    font-size: 12px;
  }
  h4 {
    font-size: 18px;
  }
}
.title__date {
  font-size: 12px;
}
.comment__message {
  width: 80%;
  padding: 10px 15px;
  border: 1px solid rgba(0, 0, 0, 0.146);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.comment__img {
  position: relative;
  width: 60px;
  padding-bottom: 60px;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s;
    cursor: pointer;
  }
}
.comment__img-thumb:hover {
  transform: scale(1.05);
}
.comment__box-btn {
  display: flex;
  align-items: center;
  gap: 15px;
  button {
    border: none;
    background-color: gray;
    color: #fff;
    &:hover {
      background-color: green;
      cursor: pointer;
    }
  }
}
</style>
