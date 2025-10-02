import { create } from "zustand";

type State = {
  selectedNumbers: number[];
  remaining: number;
  setRemaining: (r: number) => void;
  addNumber: (num: number) => void;
  reset: () => void;
};

export const useRaffleStore = create<State>((set) => ({
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
