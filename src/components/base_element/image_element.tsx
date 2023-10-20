import { ImageIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '@/store/constants';
import { usePrintElementListStore, defalutImageElement } from '@/store';

export const ImageElement: React.FC<React.PropsWithChildren> = () => {
  const addPrintElement = usePrintElementListStore(
    (state: any) => state.addDropElement,
  );

  const [, drag] = useDrag(
    () => ({
      type: ItemTypes.KNIGHT,
      end(item, monitor) {
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
              width: left,
              height: top,
            },
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
