import { ItemTypes } from '@/types/constants';
import { useDrop } from 'react-dnd';
import { useDropElementListStore, IElementType, IBaseElement } from '@/store';
import { TextPrintElement } from '@/components/print_element';

export const Print = () => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.KNIGHT,
      drop(_item: any, monitor: any) {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(delta.x);
        const top = Math.round(delta.y);
        return { top, left };
      },
      canDrop: (_item, monitor) => {
        const itemMonitor = monitor.getItem();
        console.log('monitor', itemMonitor, monitor);
        return true;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [],
  );

  const dropList = useDropElementListStore((state: any) => state.dropList);
  console.log('dropList2----->', dropList);
  return (
    <div className="container flex justify-center p-[20px]">
      <div
        ref={drop}
        style={{
          position: 'relative',
        }}
        className="print-content w-[1200px] bg-[#fff] shadow-lg"
      >
        {dropList.length > 0 &&
          dropList.map((item: IBaseElement) => {
            if (item.type === IElementType.Text) {
              return <TextPrintElement key={item.uuid} {...item} />;
            } else if (item.type === IElementType.Image) {
              return <div key={item.uuid}>Image</div>;
            }
          })}
      </div>
    </div>
  );
};
