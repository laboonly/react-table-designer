import { ItemTypes } from '@/store/constants';
import { useDrop } from 'react-dnd';
import {
  usePrintElementListStore,
  IElementType,
  IBaseElementType,
  useSelectElementInfoStore,
  useSheetShow,
  usePrintRecordElementListStore,
  useSettingModalStore,
  IPrintElementListType,
  ISelectElementInfoType,
  ISheetShowStoreType,
  IPrintRecordElementListType,
  ISettingModalType,
} from '@/store';
import {
  TextPrintElement,
  ImagePrintElement,
  TablePrintElement,
  PdfPrintElement,
} from '@/components/print_element';

type NullableString = string | null;

const findAttributeId = (
  element: HTMLElement | HTMLDivElement,
): NullableString => {
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

interface IPrintPropsType {
  printRef: React.RefObject<HTMLDivElement>;
}

export const Print: React.FC<React.PropsWithChildren<IPrintPropsType>> = (
  props,
) => {
  const { printRef } = props;

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.KNIGHT,
      drop(_item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (!delta) return;
        const left = Math.round(delta.x);
        const top = Math.round(delta.y);
        return { top, left };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [],
  );

  const { closeSheet } = useSheetShow((state: ISheetShowStoreType) => state);

  const { printList } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
  );

  const { selectElementInfo, changeSelectElementInfo } =
    useSelectElementInfoStore((state: ISelectElementInfoType) => state);

  const { settingModal } = useSettingModalStore(
    (state: ISettingModalType) => state,
  );

  const { printRecordList } = usePrintRecordElementListStore(
    (state: IPrintRecordElementListType) => state,
  );

  // 重置选择元素
  const initEditElement = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const targetId = findAttributeId(e.target as HTMLDivElement);
    if (!targetId || targetId === 'root' || targetId === 'print') {
      changeSelectElementInfo(
        selectElementInfo === null
          ? null
          : { ...selectElementInfo, isEdit: false },
      );
      closeSheet();
    }
  };

  return (
    <div className="container h-full p-[20px]" ref={drop}>
      <div
        id="print"
        ref={printRef}
        className="print-content relative h-full  overflow-y-scroll bg-[#fff]"
        onClick={(e) => initEditElement(e)}
      >
        {settingModal && (
          <div
            className="h-[1627px] w-full"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              background:
                'linear-gradient(90deg,rgba(0,0,0,.1) 1px,transparent 0),linear-gradient(1turn,rgba(0,0,0,.1) 1px,transparent 0)',
              backgroundSize: '10px 10px',
              backgroundPosition: '0 0',
              border: 'border: 1px dashed hsla(0,0%,66.7%,.7)',
              opacity: 1,
            }}
          ></div>
        )}
        {printList.length > 0 &&
          printList.map((item: IBaseElementType) => {
            switch (item.type) {
              case IElementType.Text:
                return <TextPrintElement key={item.uuid} elementInfo={item} />;
              case IElementType.Image:
                return <ImagePrintElement key={item.uuid} elementInfo={item} />;
              case IElementType.Table:
                return <TablePrintElement key={item.uuid} elementInfo={item} />;
              case IElementType.Pdf:
                return <PdfPrintElement key={item.uuid} elementInfo={item} />;
            }
          })}
        {printRecordList.length > 0 &&
          printRecordList.map((item: IBaseElementType) => {
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
