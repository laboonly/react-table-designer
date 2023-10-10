import { TextIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '@/types/constants';
import { useState } from 'react';

interface ITextProps {
  text?: string;
  style?: any;
}

export const TextElement: React.FC<React.PropsWithChildren<ITextProps>> = (
  props,
) => {
  const { text } = props;
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.KNIGHT,
      end(item, monitor) {
        console.log('item---->', item, monitor.didDrop());
        let top = 0,
          left = 0;
        if (monitor.didDrop()) {
          const dropRes = monitor.getDropResult() as any; //获取拖拽对象所处容器的数据
          console.log('dropRes---->', dropRes);
          if (dropRes) {
            top = dropRes.top;
            left = dropRes.left;
          }
          setOffsetX((offsetX) => offsetX + left);
          setOffsetY((offsetY) => offsetY + top);
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
  console.log('isDragging', isDragging);
  return (
    <div
      ref={drag}
      id="textElementId"
      style={{
        top: `${offsetY}px`,
        left: `${offsetX}px`,
        position: 'relative',
        zIndex: 100,
      }}
    >
      <Button className="w-[100%] justify-start" variant="outline">
        <TextIcon className="w-4.h mr-2" />
        {text ? text : 'Text'}
      </Button>
    </div>
  );
};
