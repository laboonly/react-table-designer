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
  src?: string;
  uuid?: string;
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

// 默认元素列表
export const defalutBaseElements: IBaseElement[] = [
  defalutTextElement,
  defalutImageElement,
];

// 拖拽元素列表
export const useDragElementStore = create((set) => ({
  dragList: [] as IBaseElement[],
  addDragElement: (element: IBaseElement, index: number) =>
    set((state: any) => {
      state.dragList.splice(index, 0);
      return { dragList: state.dragList };
    }, true),
  initDargList: () => set({ dragList: defalutBaseElements }),
}));

// 打印元素列表
export const useDropElementListStore = create((set) => ({
  dropList: [] as IBaseElement[],
  addDropElement: (element: IBaseElement) =>
    set((state: any) => {
      state.dropList.push(element);
      return { dropList: state.dropList };
    }),
  updateDropElement: (elementInfo: IBaseElement) =>
    set((state: any) => {
      let index = 0;
      state.dropList.forEach((element: IBaseElement, i: number) => {
        if (element.uuid === elementInfo.uuid) {
          index = i;
        }
      });
      state.dropList[index] = elementInfo;
      console.log('state.dropList----->', state.dropList);
      return { dropList: state.dropList };
    }),
}));

interface IElementStyles {
  width: number;
  height: number;
  color: string;
}

export interface IElementInfo extends IBaseElement {
  isEdit: boolean;
  uuid: string;
  type: IElementType;
  styles?: IElementStyles;
}

// 选中打印元素信息
export const useDropElementInfoStore = create((set) => ({
  dropElementInfo: {} as IElementInfo,
  changeDropElementInfo: (elementInfo: IElementInfo) =>
    set({ dropElementInfo: elementInfo }),
}));
