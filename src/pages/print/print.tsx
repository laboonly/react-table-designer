import { ItemTypes } from '@/store/constants';
import { useDrop } from 'react-dnd';
import {
  usePrintElementListStore,
  IElementType,
  IBaseElementType,
  useSelectElementInfoStore,
  useSheetShow,
} from '@/store';
import {
  TextPrintElement,
  ImagePrintElement,
} from '@/components/print_element';

const findAttributeId: any = (element: any) => {
  // 如果当前元素包含了所需属性，返回该属性的值
  if (element.hasAttribute('id')) {
    return element.getAttribute('id');
  } else {
    // 否则，递归查找父元素的属性
    if (element.parentElement) {
      return findAttributeId(element.parentElement);
    } else {
      // 如果没有父元素，返回null
      return null;
    }
  }
};

export const Print = () => {
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.KNIGHT,
      drop(_item: any, monitor: any) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(delta.x);
        const top = Math.round(delta.y);
        console.log('left', left, 'top', top);
        return { top, left };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [],
  );

  const { closeSheet } = useSheetShow((state: any) => state);

  const { printList } = usePrintElementListStore((state: any) => state);
  const { selectElementInfo, changeSelectElementInfo } =
    useSelectElementInfoStore((state: any) => state);

  const initEditElement = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const tagetId = findAttributeId(e.target);
    if (!tagetId || tagetId === 'root') {
      changeSelectElementInfo({ ...selectElementInfo, isEdit: false });
      closeSheet();
    }
  };

  return (
    <div className="container flex justify-center p-[20px]">
      <div
        ref={drop}
        style={{
          position: 'relative',
        }}
        className="print-content w-[1200px] bg-[#fff] shadow-lg"
        onClick={(e) => initEditElement(e)}
      >
        {printList.length > 0 &&
          printList.map((item: IBaseElementType) => {
            if (item.type === IElementType.Text) {
              return <TextPrintElement key={item.uuid} elementInfo={item} />;
            } else if (item.type === IElementType.Image) {
              return <ImagePrintElement key={item.uuid} elementInfo={item} />;
            }
          })}
      </div>
    </div>
  );
};
