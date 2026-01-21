<template>
  <div class="form">
    <div class="form__menu menu">
      <CommentToolbar class="menu__wrap-text" @wrap="wrapText" />
    </div>
    <div class="form__box">
      <form class="form__write" @submit.prevent="submit">
        <div class="form__block-inp">
          <textarea
            ref="textareaRef"
            v-model="content"
            placeholder="Write your comment..."
          />
          <input
            class="form__file"
            type="file"
            accept="image/*,.txt"
            @change="onFile"
          />
          <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
        </div>

        <button type="submit">Send</button>
      </form>
      <CommentsTable class="form__sort" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentToolbar from "./CommentToolbar.vue";
import { useForm, useField } from "vee-validate";
import { useCommentsStore } from "@/stores/commentsStore";
import { schema } from "../../utils/comment/comment.schem";
import CommentsTable from "./CommentsTable.vue";
//---------------------------------------//
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const commentsStore = useCommentsStore();
const file = ref<File | null>(null);
//---------------------------------------//
watch(
  () => commentsStore.currentAnswer,
  (val) => {
    if (val) {
      content.value = `@${val.parentName}, ` + (content.value || "");
    }
  },
);

//---------------------------------------//

function wrapText({ open, close }: { open: string; close: string }) {
  if (!textareaRef.value) return;

  const textarea = textareaRef.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const before = content.value.slice(0, start);
  const selected = content.value.slice(start, end);
  const after = content.value.slice(end);

  content.value = before + open + selected + close + after;

  nextTick(() => {
    textarea.focus();
    textarea.setSelectionRange(
      start + open.length,
      start + open.length + selected.length,
    );
  });
}
//---------------------------------------//
const onFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  file.value = target.files?.[0] ?? null;
};

//---------------------------------------//

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    content: "",
  },
});

const { value: content, errorMessage } = useField<string>("content");

const submit = handleSubmit(async (values) => {
  const formData = new FormData();
  formData.append("content", values.content);

  if (commentsStore.currentAnswer?.parentId) {
    formData.append("parentId", String(commentsStore.currentAnswer.parentId));
  }

  if (file.value instanceof File) {
    formData.append("file", file.value);
  }

  await commentsStore.createComments(formData);

  file.value = null;
  if (fileInputRef.value) fileInputRef.value.value = "";

  commentsStore.clearCurrentAnswer();
  resetForm();
});
</script>

<style lang="scss" scoped>
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 25px;
}
.menu {
  display: flex;
  align-items: center;
  gap: 15px;

  &__preview {
    display: flex;
    align-items: flex-end;

    button {
      padding: 2px 7px;
      border: none;
      background-color: purple;
      color: #fff;
    }
  }
}
.form__box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.form__write {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;

  button {
    padding: 11px;
    background-color: green;
    color: #fff;
    border: none;
    cursor: pointer;
  }
}
.form__block-inp {
  width: 100%;
  display: flex;
  flex-direction: column;

  textarea {
    width: 100%;
  }
}
.error {
  color: red;
}
</style>
