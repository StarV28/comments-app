<template>
  <div class="wrapper">
    <form class="form" @submit.prevent="onSubmit">
      <!-- Username -->
      <div class="form__box-inp">
        <label>User Name</label>
        <Field name="username" type="text" />
        <ErrorMessage name="username" class="error" />
      </div>

      <!-- Email -->
      <div class="form__box-inp">
        <label>E-mail</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" class="error" />
      </div>

      <!-- Password -->
      <div class="form__box-inp">
        <label>Password</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" class="error" />
      </div>

      <button class="form__btn" type="submit" :disabled="!meta.valid">
        Send
      </button>
      <NuxtLink to="/login" class="form__btn_reg">Back to Login</NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm, Field, ErrorMessage } from "vee-validate";
import { registerSchema } from "~/utils/auth/auth.schem";
import { useAuthStore } from "@/stores/authStore";
import type { CreateUserDto } from "../../types/auth.type";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

//-------------------------------------------------------------------------------------//
const authStore = useAuthStore();
const router = useRouter();
// ---------------- FORM ---------------- //
const { handleSubmit, meta, resetForm } = useForm<RegisterForm>({
  validationSchema: registerSchema,
});

// ---------------- SUBMIT ---------------- //
const onSubmit = handleSubmit(async (values) => {
  const payload: CreateUserDto = {
    username: values.username,
    email: values.email,
    password: values.password,
  };

  await authStore.getUserCreate(payload);
  resetForm();
  router.push("/user");
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form {
  width: 350px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 15px;

  &__box-inp {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    input {
      width: 100%;
      padding: 2px 5px;
    }
  }

  &__btn {
    margin-top: 10px;
    width: 100%;
    padding: 5px;
    border: none;
    background-color: green;
    color: #fff;
  }
  &__btn:disabled {
    background-color: rgba(128, 128, 128, 0.434);
    cursor: pointer;
  }
  &__btn_reg {
    margin-top: 10px;
    padding: 5px 25px;
    text-align: center;
    margin: 0 auto;
    background-color: green;
    color: #fff;
    cursor: pointer;
  }
}
.error {
  font-size: 12px;
  font-weight: 500;
  color: red;
}
</style>
