import { create } from "zustand";
import { persist } from "zustand/middleware";

const customStorage = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    if (!item) return null;

    const { value, timestamp } = JSON.parse(item);
    const now = new Date().getTime();

    // Check if the item is expired
    if (now - timestamp > 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
      localStorage.removeItem(name);
      return null;
    }
    return value;
  },
  setItem: (name, value) => {
    const item = {
      value,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(name, JSON.stringify(item));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  }
};


const useAdminAuth = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: 'admin-auth', // name of the item in storage
      storage: customStorage,
    }
  )
);



export default useAdminAuth;
