import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@yuuri_settings";

export const useSettingsStore = create((set, get) => ({
  backendUrl: "",
  apiId: "",
  apiHash: "",
  isLoaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({ ...parsed, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      set({ isLoaded: true });
    }
  },

  update: async (updates) => {
    const current = get();
    const newState = { ...current, ...updates };
    set(updates);
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          backendUrl: newState.backendUrl,
          apiId: newState.apiId,
          apiHash: newState.apiHash,
        }),
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  },

  isConfigured: () => {
    const { backendUrl } = get();
    return !!backendUrl;
  },
}));
