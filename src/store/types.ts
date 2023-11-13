import { sourceElementTypes } from './constants';

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
  sourceType?: sourceElementTypes;
  fieldId?: string;
}

export const defalutTextElement: IBaseElementType = {
  type: IElementType.Text,
  styles: {
    left: 0,
    top: 0,
    width: 294,
    height: 66,
    fontSize: '9pt',
    lineHeight: '18pt',
    textAlign: 'left',
  },
  content: 'Text',
  isEdit: false,
};

export const defalutImageElement: IBaseElementType = {
  type: IElementType.Image,
  styles: {
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  },
  src: 'https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF',
};

// 默认元素列表
export const defalutBaseElements: IBaseElementType[] = [
  defalutTextElement,
  defalutImageElement,
];
