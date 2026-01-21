<template>
  <div>
    <GlobalLayout>
      <div class="wrapper">
        <h1>User</h1>
        <div v-if="user" class="main">
          <div class="main__user">
            <span>User Name</span>
            <h2>{{ user?.username }}</h2>
          </div>
          <div class="main__user">
            <span>E-mail</span>
            <a :href="`mailto:${user.email}`">{{ user?.email }}</a>
          </div>
        </div>
        <div v-if="user" class="box-btn">
          <button class="box-btn__logout" @click="logout">Logout</button>
          <button
            class="box-btn__del"
            type="button"
            @click="deleteUser(user.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </GlobalLayout>
  </div>
</template>

<script setup lang="ts">
import GlobalLayout from "../layout/globalLayout.vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import type { User } from "../../types/auth.type";
import auth from "../../middleware/auth";
//---------------------------------------//

definePageMeta({
  middleware: auth,
});
//---------------------------------------//

const authStore = useAuthStore();
const user = await useCookie<User | null>("user");
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
const deleteUser = async (id: string) => {
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    throw new Error("Invalid user id");
  }

  await authStore.deleteUser(numericId);

  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 15px;
  margin: 25px 0;
}
.main__user {
  max-width: 350px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}
.box-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 25px;
}
.box-btn__logout {
  padding: 5px 15px;
  font-size: 18px;
  color: #ffff;
  background-color: orangered;
  border: none;
}
.box-btn__del {
  padding: 5px 15px;
  font-size: 18px;
  color: #fff;
  background-color: red;
  border: none;
}
</style>
