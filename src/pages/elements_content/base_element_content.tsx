import { useEffect } from 'react';
import { TextElement, ImageElement } from '../../components/base_element';
import {
  useDragElementStore,
  IElementType,
  IDragElementType,
  IBaseElementType,
} from '@/store';
import { sourceElementTypes } from '@/store/constants';

export const BaseElementsContent = () => {
  const dragList = useDragElementStore(
    (state: IDragElementType) => state.dragList,
  );
  const initDargList = useDragElementStore(
    (state: IDragElementType) => state.initDargList,
  );
  useEffect(() => {
    if (dragList.length === 0) {
      initDargList();
    }
  }, []);
  return (
    <div className="flex flex-col space-y-4">
      {dragList.map((item: IBaseElementType, index: number) => {
        if (item.type === IElementType.Text) {
          return (
            <TextElement
              key={index}
              content={item.content}
              sourceType={sourceElementTypes.Base}
            />
          );
        } else if (item.type === IElementType.Image) {
          return <ImageElement key={index} />;
        }
      })}
    </div>
  );
};
