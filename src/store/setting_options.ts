import { create } from 'zustand';

export interface IPaperSizeModalType {
  paperSize: string;
  changePaperSize: (data: string) => void;
}

export const usePaperSizeStore = create<IPaperSizeModalType>()((set) => ({
  paperSize: 'A4',
  changePaperSize: (data: string) => set(() => ({ paperSize: data })),
}));
