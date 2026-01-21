<template>
  <div class="sort">
    <span class="sort__title">Sort</span>
    <button class="sort__btn" @click="sort('username')">Name</button>
    <!-- <button class="sort__btn" @click="sort('email')">E-mail</button> -->
    <button class="sort__btn" @click="sort('createdAt')">Date</button>
  </div>
</template>

<script setup lang="ts">
import { useCommentsStore } from "@/stores/commentsStore";
//---------------------------------------//

const commentsStore = useCommentsStore();

function sort(field: "createdAt" | "username" | "email") {
  commentsStore.setSort(field);
}
</script>

<style lang="scss" scoped>
.sort {
  display: flex;
  align-items: center;
  gap: 5px;
}
.sort__title {
  font-size: 18px;
  font-weight: 900;
  color: purple;
}
.sort__btn {
  width: 50px;
  padding: 11px 0;
  border: none;
  background-color: green;
  color: #fff;
  cursor: pointer;
}
</style>
