import { TextIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useDrag } from 'react-dnd';
import { ItemTypes, sourceElementTypes } from '@/store/constants';
import { useRef } from 'react';
import {
  defaultTextElement,
  usePrintElementListStore,
  usePrintRecordElementListStore,
  usePrintAreaPosition,
  IPrintElementListType,
  IPrintRecordElementListType,
  IPrintAreaPositionStoreType,
  MyDropResult,
} from '@/store';
import { v4 as uuidv4 } from 'uuid';

interface ITextProps {
  sourceType: sourceElementTypes;
  content?: string;
  style?: React.CSSProperties;
  fieldId?: string;
}

export const TextElement: React.FC<React.PropsWithChildren<ITextProps>> = (
  props,
) => {
  const { content = 'Text', style, sourceType, fieldId } = props;

  const { addPrintElement } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
  );
  const { addPrintRecordElement } = usePrintRecordElementListStore(
    (state: IPrintRecordElementListType) => state,
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
          console.log(
            'left element---->',
            left,
            offsetX,
            position.left,
            position.scrollLeft,
          );
          if (sourceType === sourceElementTypes.Base) {
            addPrintElement({
              ...defaultTextElement,
              styles: {
                ...defaultTextElement.styles,
                left: left + offsetX - position.left + position.scrollLeft,
                top: top + offsetY - position.top + position.scrollTop,
              },
              content: content,
              sourceType: sourceElementTypes.Base,
              uuid: uuidv4(),
            });
          }
          if (sourceType === sourceElementTypes.Table) {
            addPrintRecordElement({
              ...defaultTextElement,
              styles: {
                ...defaultTextElement.styles,
                left: left + offsetX - position.left + position.scrollLeft,
                top: top + offsetY - position.top + position.scrollTop,
              },
              content: content,
              uuid: uuidv4(),
              sourceType: sourceElementTypes.Table,
              fieldId: fieldId,
            });
          }
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
        id="textElementId"
        style={{
          ...style,
          position: 'relative',
          zIndex: 100,
        }}
      >
        <Button className="w-[100%] justify-start" variant="outline">
          <TextIcon className="w-4.h mr-2" />
          {content}
        </Button>
      </div>
    </div>
  );
};
