import { create } from 'zustand';

export const useElementStore = create((set) => ({
  elementShow: false,
  increasePopulation: () =>
    set((state: any) => ({ elementShow: !state.elementShow })),
  removeAllBears: () => set({ elementShow: false }),
}));
