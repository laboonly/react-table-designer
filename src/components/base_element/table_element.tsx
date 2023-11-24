import { useDrag } from 'react-dnd';
import { ItemTypes, sourceElementTypes } from '@/store/constants';
import { useRef } from 'react';
import { TextIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  usePrintElementListStore,
  IPrintElementListType,
  usePrintAreaPosition,
  IPrintAreaPositionStoreType,
  MyDropResult,
  defaultTableElement,
} from '@/store';
import { v4 as uuidv4 } from 'uuid';

export const TableElement: React.FC<React.PropsWithChildren> = () => {
  const { addPrintElement } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
  );
  const position = usePrintAreaPosition(
    (state: IPrintAreaPositionStoreType) => state.position,
  );

  const elementRef = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag(
    () => ({
      type: ItemTypes.KNIGHT,
      end(_, monitor) {
        let top = 0,
          left = 0;
        if (monitor.didDrop()) {
          const dropRes = monitor.getDropResult<MyDropResult>(); //获取拖拽对象所处容器的数据
          if (dropRes) {
            top = dropRes.top;
            left = dropRes.left;
          }
          const offsetX = elementRef.current?.offsetLeft
            ? elementRef.current?.offsetLeft
            : 0;
          const offsetY = elementRef.current?.offsetTop
            ? elementRef.current?.offsetTop
            : 0;
          // 选择性添加元素

          addPrintElement({
            ...defaultTableElement,
            styles: {
              ...defaultTableElement.styles,
              left: left + offsetX - position.left + position.scrollLeft,
              top: top + offsetY - position.top + position.scrollTop,
            },
            sourceType: sourceElementTypes.Base,
            uuid: uuidv4(),
          });
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [position],
  );

  return (
    <div ref={elementRef}>
      <div
        ref={drag}
        id="tableElementId"
        style={{
          position: 'relative',
          zIndex: 100,
        }}
      >
        <Button className="w-[100%] justify-start" variant="outline">
          <TextIcon className="w-4.h mr-2" />
          Table
        </Button>
      </div>
    </div>
  );
};
