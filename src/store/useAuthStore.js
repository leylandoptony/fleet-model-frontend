import { create } from "zustand";
import supabase from "../supabaseClient";
import useProForma from "./useProForma";


const useAuthStore = create((set, get) => ({
  user: null,
  controlsData: null,
  loading: true,
  data: [],
  message: "",

  // Log in function
  login: async (email, password) => {
    const { fetchAndUpdateFleet } = useProForma.getState();
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
      fetchAndUpdateFleet();
      return true;
    } catch (error) {
      set({ message: `Login error: ${error.message}` });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Log out function
  logout: async () => {
    const { resetFleet } = useProForma.getState();
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, data: [] });
      resetFleet();
    } catch (error) {
      set({ message: `Logout error: ${error.message}` });
    } finally {
      set({ loading: false });
    }
  },


  isLoggedIn: () => {
    const user = useAuthStore.getState().user;
    return user !== null;
  },


  // Initialize auth state from Supabase session
  initializeAuth: async () => {
    set({ loading: true });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      set({ user: session.user });
      
    }
    set({ loading: false });
  },
}));

export default useAuthStore;
