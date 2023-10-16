import {
  useDropElementInfoStore,
  IElementInfo,
  useDropElementListStore,
} from '@/store';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '@/types/constants';

export const TextPrintElement: React.FC<
  React.PropsWithChildren<IElementInfo>
> = (props) => {
  const { text, x, y, uuid, type } = props;
  const { dropElementInfo, changeDropElementInfo } = useDropElementInfoStore(
    (state: any) => state,
  );

  const { updateDropElement } = useDropElementListStore((state: any) => state);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.KNIGHT,
      end(item, monitor) {
        try {
          let top = 0,
            left = 0;
          if (monitor.didDrop()) {
            const dropRes = monitor.getDropResult() as any; //获取拖拽对象所处容器的数据
            if (dropRes) {
              top = dropRes.top;
              left = dropRes.left;
            }
            // 选择性添加元素
            updateDropElement({
              type,
              uuid,
              text,
              x: x + left,
              y: y + top,
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [],
  );

  const setEditingElement = () => {
    changeDropElementInfo({
      text,
      x,
      y,
      uuid,
      isEdit: true,
    });
  };

  const isElementEdit = dropElementInfo.uuid === uuid && dropElementInfo.isEdit;

  return (
    <div
      ref={drag}
      id={uuid}
      style={{
        position: 'relative',
        top: y,
        left: x,
        zIndex: 100,
      }}
      onClick={setEditingElement}
    >
      {isElementEdit ? <input type="text" value={text} /> : <p>{text}</p>}
    </div>
  );
};
