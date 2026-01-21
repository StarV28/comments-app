import { useAuthStore } from "../app/stores/authStore";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    try {
      await authStore.fetchUser();
    } catch {
      return navigateTo("/login");
    }
  }

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }
});
