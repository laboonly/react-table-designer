import { create } from 'zustand';

export const useElementStore = create((set) => ({
  elementShow: false,
  changeElmentShow: () =>
    set((state: any) => ({ elementShow: !state.elementShow })),
}));

export enum IElementType {
  Text = 'Text',
  Image = 'Image',
}

interface IBaseElement {
  type: IElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
}

export const defalutTextElement: IBaseElement = {
  type: IElementType.Text,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  text: 'Text',
};

export const defalutImageElement: IBaseElement = {
  type: IElementType.Image,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};

export const defalutBaseElements: IBaseElement[] = [
  defalutTextElement,
  defalutImageElement,
];

export const useDragElementStore = create((set) => ({
  dragList: [] as IBaseElement[],
  addDragElement: (element: IBaseElement, index: number) =>
    set((state: any) => {
      state.dragList.splice(index, 0);
      return { dragList: state.dragList };
    }, true),
  initDargList: () => set({ dragList: defalutBaseElements }),
}));

export const useDropElementListStore = create((set) => ({
  dropList: [] as IBaseElement[],
  addDropElement: (element: IBaseElement) =>
    set((state: any) => {
      state.dropList.push(element);
      return { dropList: state.dropList };
    }, true),
}));
