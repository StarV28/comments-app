import { defineStore } from "pinia";
import { useApi } from "@/composable/useApi";
import type {
  User,
  AuthResponse,
  CreateUserDto,
  LoginDto,
  DeleteResponse,
} from "../../types/auth.type";

//-------------------------------------------------------------------------------------//
export const useAuthStore = defineStore("authStore", () => {
  const api = useApi();
  const changeUserComp = ref<boolean>(true);
  const isAuthenticated = ref<boolean>(false);
  const tokenCookie = useCookie("token", {
    maxAge: 60 * 60,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
  const userCookie = useCookie<User | null>("user", {
    maxAge: 60 * 60,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
  //-------------------------------------------------------------------------------------//

  const setToken = (t: string) => {
    tokenCookie.value = t;
  };
  //-------------------------------------------------------------------------------------//
  const fetchUser = async () => {
    try {
      const data = await api.get<AuthResponse>("/auth/me", {}, false);
      if (!data) {
        isAuthenticated.value = false;
        userCookie.value = null;
        throw new Error("No response from API");
      }

      isAuthenticated.value = true;
      userCookie.value = data.user;
    } catch (err) {
      isAuthenticated.value = false;
      userCookie.value = null;
      throw err;
    }
  };
  //-------------------------------------------------------------------------------------//

  const getUserCreate = async (data: CreateUserDto) => {
    try {
      const result = await api.post<AuthResponse>(
        "/auth/signUp",
        { data },
        false
      );

      if (!result) throw new Error("No response from API");

      tokenCookie.value = result.token;
      userCookie.value = result.user;

      return result;
    } catch (err) {
      console.error("Error create User", (err as Error)?.message);
      return null;
    }
  };
  //-------------------------------------------------------------------------------------//
  const getLogIn = async (data: LoginDto) => {
    try {
      const result = await api.post<AuthResponse>(
        "/auth/login",
        { data },
        false
      );
      if (!result) throw new Error("No response from API");

      userCookie.value = result.user;
      tokenCookie.value = result.token;

      return result;
    } catch (err) {
      console.error("Error login User", (err as Error)?.message);
      return null;
    }
  };
  //---------------------------------------//

  const deleteUser = async (id: number) => {
    try {
      const result = await api.del<DeleteResponse>(`/auth/${id}`, {}, false);
      if (result?.success) {
        alert("Delete user success");
      }
    } catch (err) {
      console.error("Error delete User", (err as Error)?.message);
      return null;
    }
  };
  //---------------------------------------//

  const logout = () => {
    userCookie.value = null;
    tokenCookie.value = null;
    isAuthenticated.value = false;
  };
  //---------------------------------------//

  return {
    setToken,
    getUserCreate,
    getLogIn,
    fetchUser,
    logout,
    changeUserComp,
    isAuthenticated,
    deleteUser,
  };
});
