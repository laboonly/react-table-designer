export enum IElementType {
  Text = 'Text',
  Image = 'Image',
}

export interface IBaseElementType {
  type: IElementType;
  styles: React.CSSProperties;
  content?: string;
  src?: string;
  uuid?: string;
  isEdit?: boolean;
}

export const defalutTextElement: IBaseElementType = {
  type: IElementType.Text,
  styles: {
    left: 0,
    top: 0,
    width: 200,
    height: 60,
  },
  content: 'Text',
  isEdit: false,
};

export const defalutImageElement: IBaseElementType = {
  type: IElementType.Image,
  styles: {
    left: 0,
    top: 0,
    width: 50,
    height: 50,
  },
};

// 默认元素列表
export const defalutBaseElements: IBaseElementType[] = [
  defalutTextElement,
  defalutImageElement,
];
