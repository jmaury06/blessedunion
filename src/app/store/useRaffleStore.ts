import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  )
);

type RaffleState = {
  selectedNumbers: number[];
  remaining: number;
  setRemaining: (r: number) => void;
  addNumber: (num: number) => void;
  reset: () => void;
};

export const useRaffleStore = create<RaffleState>((set) => ({
  selectedNumbers: [],
  remaining: 0,
  setRemaining: (r) => set({ remaining: r }),
  addNumber: (num) =>
    set((state) => ({
      selectedNumbers: [...state.selectedNumbers, num],
      remaining: state.remaining > 0 ? state.remaining - 1 : 0,
    })),
  reset: () => set({ selectedNumbers: [], remaining: 0 }),
}));
