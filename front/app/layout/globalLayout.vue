<template>
  <div class="wrapper">
    <header>
      <HeaderTest />
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderTest from "../conponents/header/headerTest.vue";
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}
header {
  border-bottom: 1px solid rgba(128, 128, 128, 0.359);
  margin-bottom: 20px;
}
main {
  flex: 1 0 auto;
}
</style>
