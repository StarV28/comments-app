<template>
  <div class="toolbar">
    <button @click="emitWrap('<i>', '</i>')">i</button>
    <button @click="emitWrap('<strong>', '</strong>')">strong</button>
    <button @click="emitWrap('<code>', '</code>')">code</button>
    <button
      @click="emitWrap('<a href=&quot;&quot; title=&quot;&quot;>', '</a>')"
    >
      a
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "wrap", payload: { open: string; close: string }): void;
}>();
function emitWrap(open: string, close: string) {
  emit("wrap", { open, close });
}
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 5px;

  button {
    padding: 2px 7px;
    border: none;
    background-color: purple;
    color: #fff;
  }
}
</style>
