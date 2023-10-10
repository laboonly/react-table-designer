import { ItemTypes } from '@/types/constants';
import { useDrop } from 'react-dnd';

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
  return (
    <div className="container flex justify-center p-[20px]">
      <div
        ref={drop}
        style={{
          position: 'relative',
        }}
        className="print-content w-[1200px] bg-[#fff] shadow-lg"
      ></div>
    </div>
  );
};
