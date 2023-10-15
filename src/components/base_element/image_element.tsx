import { ImageIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '@/types/constants';
import { useDropElementListStore, defalutImageElement } from '@/store';

interface IImageProps {
  index: number;
}

export const ImageElement: React.FC<React.PropsWithChildren<IImageProps>> = ({
  index,
}) => {
  const addDropElement = useDropElementListStore(
    (state: any) => state.addDropElement,
  );

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

          addDropElement({
            ...defalutImageElement,
            x: left,
            y: top,
          });
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
