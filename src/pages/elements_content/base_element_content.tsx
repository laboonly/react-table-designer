import { useEffect } from 'react';
import { TextElement, ImageElement } from '../../components/base_element';
import { useDragElementStore, IElementType } from '../../store';

export const BaseElementsContent = () => {
  const dragList = useDragElementStore((state: any) => state.dragList);
  const initDargList = useDragElementStore((state: any) => state.initDargList);
  useEffect(() => {
    if (dragList.length === 0) {
      initDargList();
    }
  }, []);
  return (
    <div className="flex flex-col space-y-4">
      {dragList.map((item: any, index: number) => {
        if (item.type === IElementType.Text) {
          return <TextElement key={index} text={item.text} />;
        } else if (item.type === IElementType.Image) {
          return <ImageElement key={index} />;
        }
      })}
    </div>
  );
};
