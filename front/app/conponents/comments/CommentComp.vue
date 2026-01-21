<template>
  <div class="wrapper">
    <div
      v-for="comment in commentsStore.comments"
      :key="comment.id"
      class="comment"
    >
      <div class="comment__title title">
        <div class="title__name">
          <span>User</span>
          <h4>{{ comment.user.username }}</h4>
        </div>
        <div class="title__date">
          <span>{{ formatDate(comment.createdAt) }}</span>
        </div>
      </div>
      <div class="comment__message">
        <span v-html="comment.content" />
        <div
          v-if="comment.files && comment.files.type === 'image'"
          class="comment__img"
        >
          <img
            :src="comment.files.url"
            :alt="comment.files.originalName"
            @click="show = true"
          />
          <vue-easy-lightbox
            :visible="show"
            :imgs="[comment.files.url]"
            @hide="show = false"
          />
        </div>
        <div v-else-if="comment.files && comment.files.type === 'txt'">
          <a :href="comment.files.url" target="_blank">
            {{ comment.files.originalName }}
          </a>
        </div>
      </div>
      <div class="comment__box-btn">
        <button @click="onAnswer(comment)">Answer</button>
        <button
          v-if="comment._count.replies > 0"
          class="reply-toggle"
          @click="commentsStore.toggleReplies(comment.id)"
        >
          {{
            commentsStore.showReplies[comment.id]
              ? "Hide replies"
              : "Show replies"
          }}
        </button>
        <button
          v-if="comment.user.id === user?.id"
          @click="
            onDelete(
              comment.id,
              comment.parentId,
              comment.files ? comment.files.id : null,
            )
          "
        >
          Delete
        </button>
      </div>
      <CommentReplies
        v-if="commentsStore.showReplies[comment.id]"
        :parent-id="comment.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommentsStore } from "@/stores/commentsStore";
import CommentReplies from "./CommentReplies.vue";
import type { Comment, User } from "../../../types/comments.type";
import VueEasyLightbox from "vue-easy-lightbox";

//---------------------------------------//
const show = ref(false);
const commentsStore = useCommentsStore();
const user = await useCookie<User | null>("user");

function onAnswer(comment: Comment) {
  commentsStore.showReplies[comment.id] = true;
  commentsStore.setCurrentAnswer(comment.id, comment.user?.username);
}

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}
const onDelete = (
  id: number,
  parentId: number | null,
  fileId: number | null,
) => {
  commentsStore.deleteComment(id, parentId, fileId);
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 15px;
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
