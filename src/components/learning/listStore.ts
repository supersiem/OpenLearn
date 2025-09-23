import { create } from 'zustand';

interface ListStore {
  text: string;
  updateText: (newText: string) => void;
}

export const useListStore = create<ListStore>((set) => ({
  text: "Hello from store!",
  updateText: (newText: string) => set({ text: newText }),
}));