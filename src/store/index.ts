import { create } from 'zustand';

export const useElementStore = create((set) => ({
  elementShow: false,
  changeElmentShow: () =>
    set((state: any) => ({ elementShow: !state.elementShow })),
}));

enum IElementType {
  Text = 'Text',
  Imag = 'Imag',
}

interface IElement {
  type: IElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
}

export const useDragElementStore = create((set) => ({
  dragList: [] as IElement[],
  addDragList: (element: IElement) =>
    set((state: any) => {
      const list = state.dragList.push(element);
      return { dragList: list };
    }),
}));
