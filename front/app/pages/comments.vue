<template>
  <GlobalLayout>
    <div class="wrapper">
      <div class="main">
        <CommentComp class="main__comments" />
        <div class="main__pagination">
          <button
            v-for="page in commentsStore.totalPages"
            :key="page"
            :class="{ active: page === commentsStore.currentPage }"
            @click="commentsStore.setPage(page)"
          >
            {{ page }}
          </button>
        </div>
      </div>
      <CommentForm class="main__form" />
    </div>
  </GlobalLayout>
</template>

<script setup lang="ts">
import CommentForm from "../conponents/comments/CommentForm.vue";
import GlobalLayout from "../layout/globalLayout.vue";

import { useCommentsStore } from "@/stores/commentsStore";
import auth from "../../middleware/auth";
import CommentComp from "../conponents/comments/CommentComp.vue";
//---------------------------------------//

definePageMeta({
  middleware: auth,
});

//---------------------------------------//

const commentsStore = useCommentsStore();

//---------------------------------------//
onMounted(() => {
  commentsStore.fetchComments();
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  position: relative;
}
.main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-bottom: 120px;
}
.main__comments {
  flex-grow: 1;
}
.main__pagination {
  width: 100%;
  margin: 25px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  button {
    border: none;
    background-color: grey;
    color: #fff;
    cursor: pointer;
  }
}
.main__form {
  position: absolute;
  bottom: 0;
}
</style>
