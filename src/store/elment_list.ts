import { create } from 'zustand';
import { produce } from 'immer';
import { defalutBaseElements, IBaseElementType } from './types';

export const useSettingModalStore = create((set) => ({
  settingModal: false,
  changeSettingModal: () =>
    set((state: any) => ({ settingModal: !state.settingModal })),
}));

// 拖拽元素列表
export const useDragElementStore = create((set) => ({
  dragList: [] as IBaseElementType[],
  addDragElement: (element: IBaseElementType, index: number) =>
    set((state: any) => {
      state.dragList.splice(index, 0);
      return { dragList: state.dragList };
    }, true),
  initDargList: () => set({ dragList: defalutBaseElements }),
}));

// 打印元素列表
export const usePrintElementListStore = create((set) => ({
  printList: [] as IBaseElementType[],
  addPrintElement: (elementInfo: IBaseElementType) =>
    set((state: any) => {
      const newstate = produce(state.printList, (draftState: any) => {
        draftState.push(elementInfo);
      });
      return { printList: newstate };
    }),
  updatePrintElement: (elementInfo: IBaseElementType) =>
    set((state: any) => {
      let index = 0;
      state.printList.forEach((element: IBaseElementType, i: number) => {
        if (element.uuid === elementInfo.uuid) {
          index = i;
        }
      });
      const newstate = produce(state.printList, (draftState: any) => {
        draftState[index] = elementInfo;
      });
      return { printList: newstate };
    }),
}));

// 选中打印元素信息
export const useSelectElementInfoStore = create((set) => ({
  selectElementInfo: null as IBaseElementType | null,
  changeSelectElementInfo: (elementInfo: IBaseElementType) =>
    set((state: any) => {
      console.log('selectElementInfo', elementInfo);
      return {
        selectElementInfo: { ...elementInfo },
        changeSelectElementInfo: state.changeSelectElementInfo,
      };
    }, true),
}));

// 设置元素样式弹窗的显示

export const useSheetShow = create((set) => ({
  open: false,
  changeSheetShow: () => set((state: any) => ({ open: !state.open })),
  closeSheet: () => set({ open: false }),
  openSheet: () => set({ open: true }),
}));
