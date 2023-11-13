import {
  useSelectElementInfoStore,
  IBaseElementType,
  usePrintElementListStore,
  useSettingModalStore,
  sourceElementTypes,
  usePrintRecordElementListStore,
  useTableRecordData,
  IPrintElementListType,
  ISelectElementInfoType,
  ITableRecordDataStoreType,
  IPrintRecordElementListType,
  ISettingModalType,
} from '@/store';
import { Textarea } from '@/components/ui/textarea';
import { Rnd } from 'react-rnd';
import { useMemo } from 'react';

interface ITextPropsType {
  elementInfo: IBaseElementType;
}

const resizeHandleStyle = {
  content: '',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: '#020617',
};

export const TextPrintElement: React.FC<
  React.PropsWithChildren<ITextPropsType>
> = (props) => {
  const { elementInfo } = props;
  const { content, styles, uuid, sourceType, fieldId } = elementInfo;
  const { width = 200, height = 60, top, left } = styles;

  const { selectElementInfo, changeSelectElementInfo } =
    useSelectElementInfoStore((state: ISelectElementInfoType) => state);

  const settingModal = useSettingModalStore(
    (state: ISettingModalType) => state.settingModal,
  );
  const { updatePrintElement } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
  );

  const { updatePrintRecordElement } = usePrintRecordElementListStore(
    (state: IPrintRecordElementListType) => state,
  );

  const { recordIndex, records } = useTableRecordData(
    (state: ITableRecordDataStoreType) => state,
  );

  const isElementEdit = useMemo(() => {
    if (!selectElementInfo) {
      return false;
    }
    return selectElementInfo.uuid === uuid && selectElementInfo.isEdit;
  }, [selectElementInfo]);

  const setEditingElement = () => {
    if (!settingModal) return;
    changeSelectElementInfo({
      ...elementInfo,
      isEdit: true,
    });
  };

  const valueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePrintElement({
      ...elementInfo,
      content: e.target.value,
    });
    changeSelectElementInfo({
      ...elementInfo,
      isEdit: true,
      content: e.target.value,
    });
  };

  return (
    <Rnd
      id={uuid}
      default={{ x: left as number, y: top as number, width, height }}
      size={{ width: (width as number) + 10, height: (height as number) + 10 }}
      disableDragging={isElementEdit || !settingModal}
      enableResizing={settingModal}
      position={{ x: left as number, y: top as number }}
      resizeHandleStyles={
        settingModal
          ? {
              bottomLeft: resizeHandleStyle,
              bottomRight: resizeHandleStyle,
              topLeft: resizeHandleStyle,
              topRight: resizeHandleStyle,
            }
          : {}
      }
      onDragStop={(_, d) => {
        if (sourceType === sourceElementTypes.Base) {
          updatePrintElement({
            ...elementInfo,
            styles: {
              ...styles,
              left: d.x,
              top: d.y,
            },
          });
        } else {
          updatePrintRecordElement({
            ...elementInfo,
            styles: {
              ...styles,
              left: d.x,
              top: d.y,
            },
          });
        }
      }}
      onResizeStop={(_, direction, ref, delta, position) => {
        if (sourceType === sourceElementTypes.Base) {
          updatePrintElement({
            ...elementInfo,
            styles: {
              ...styles,
              left: position.x,
              top: position.y,
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
            },
          });
        } else {
          updatePrintRecordElement({
            ...elementInfo,
            styles: {
              ...styles,
              left: position.x,
              top: position.y,
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
            },
          });
        }
      }}
      style={{
        border: settingModal ? '1px solid #020617' : 'none',
        // padding: '10px 10px',
        cursor: settingModal ? 'move' : 'default',
        wordWrap: 'break-word',
        color: styles.color,
        fontSize: styles.fontSize,
        textAlign: styles.textAlign,
        lineHeight: styles.lineHeight,
      }}
      onClick={setEditingElement}
    >
      {sourceType !== sourceElementTypes.Table ? (
        <>
          {isElementEdit ? (
            <Textarea
              style={{
                padding: '0px 0px',
                fontSize: styles.fontSize,
                textAlign: styles.textAlign,
                lineHeight: styles.lineHeight,
              }}
              value={content}
              onChange={(e) => valueChange(e)}
              className="w-full h-full rounded-none"
            />
          ) : (
            <p>{content}</p>
          )}
        </>
      ) : (
        fieldId && <p>{records[recordIndex].fields[fieldId]}</p>
      )}
    </Rnd>
  );
};
