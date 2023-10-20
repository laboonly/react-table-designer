import { ImageIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '@/store/constants';
import { usePrintElementListStore, defalutImageElement } from '@/store';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

export const ImageElement: React.FC<React.PropsWithChildren> = () => {
  const addPrintElement = usePrintElementListStore(
    (state: any) => state.addPrintElement,
  );
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const [, drag] = useDrag(
    () => ({
      type: ItemTypes.KNIGHT,
      end(_, monitor) {
        let top = 0,
          left = 0;
        if (monitor.didDrop()) {
          const dropRes = monitor.getDropResult() as any; //获取拖拽对象所处容器的数据
          if (dropRes) {
            top = dropRes.top;
            left = dropRes.left;
          }
          addPrintElement({
            ...defalutImageElement,
            styles: {
              ...defalutImageElement.styles,
              left: left,
              top: top,
            },
            uuid: uuidv4(),
          });
        } else {
          setOffsetX(0);
          setOffsetY(0);
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [],
  );

  return (
    <div
      ref={drag}
      id="imageElementId"
      style={{
        top: `${offsetY}px`,
        left: `${offsetX}px`,
        position: 'relative',
        zIndex: 100,
      }}
    >
      <Button className="w-[100%] justify-start" variant="outline">
        <ImageIcon className="w-4.h mr-2" />
        Image
      </Button>
    </div>
  );
};
