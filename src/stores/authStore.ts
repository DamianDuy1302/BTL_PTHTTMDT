import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      // cái isAuthReady này mình học của Thảo, vì khi quản lí state, nếu hard-reload lại sẽ bị mất dữ liệu
      // nếu mà chỉ check nguyên user như ở trong authProtectedRoute thì sẽ bị lỗi là đá sang login xong lại đá vào cart
      // nên mình thêm cái này
      isAuthReady: false,
      addUserData: (data: any) =>
        set((state) => ({
          user: data,
          isAuthReady: true,
        })),
      clearUserData: () =>
        set((state) => ({
          user: null,
          isAuthReady: true,
        })),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
