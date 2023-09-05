import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "../../types";

const authStore = (
  set: any
): {
  userProfile: IUser | null;
  addUser: (user: IUser) => void;
  allUsers: IUser[];
  removeUser: () => void;
  fetchAllUsers: () => void;
} => ({
  userProfile: null,
  allUsers: [],
  addUser: (user) => set({ userProfile: user }),
  removeUser: () => set({ userProfile: null }),
  fetchAllUsers: async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`
    );

    set({ allUsers: response.data });
  },
});

const useAuthStore = create(persist(authStore, { name: "auth" }));

export default useAuthStore;
