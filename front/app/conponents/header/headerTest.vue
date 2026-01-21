<template>
  <div class="header">
    <div class="header__logo">
      <span>TS</span>
    </div>
    <div class="header__menu">
      <ul class="list">
        <NuxtLink to="/user" class="item">User</NuxtLink>
        <NuxtLink to="/comments" class="item">Comments</NuxtLink>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.header {
  width: 100%;
  padding: 25px 0;
  display: flex;
  justify-content: space-between;
}
.header__logo {
  span {
    font-size: 21px;
    font-weight: 700;
    line-height: 1.1;
  }
}
.list {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
}
.item {
  list-style: none;
  cursor: pointer;
  text-transform: capitalize;
  text-decoration: underline;
  &:hover {
    color: blue;
  }
}
</style>
