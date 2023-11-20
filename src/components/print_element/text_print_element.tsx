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
import { useMemo, useRef } from 'react';
import Moveable from 'react-moveable';
import { flushSync } from 'react-dom';
import { radiansToDegrees } from '@/lib/utils';

interface ITextPropsType {
  elementInfo: IBaseElementType;
}

export const TextPrintElement: React.FC<
  React.PropsWithChildren<ITextPropsType>
> = (props) => {
  const { elementInfo } = props;
  const { content, styles, uuid, sourceType, fieldId, rotate } = elementInfo;
  const { width = 200, height = 60, top, left } = styles;
  const targetRef = useRef<HTMLImageElement>(null);

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
    <div
      id={uuid}
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        padding: '10px 10px',
      }}
    >
      <div
        ref={targetRef}
        style={{
          border: settingModal ? '1px solid #020617' : 'none',
          cursor: settingModal ? 'move' : 'default',
          wordWrap: 'break-word',
          color: styles.color,
          fontSize: styles.fontSize,
          textAlign: styles.textAlign,
          lineHeight: styles.lineHeight,
          transform: `rotate(${rotate}deg)`,
        }}
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
                className="h-full w-full rounded-none"
              />
            ) : (
              <p>{content}</p>
            )}
          </>
        ) : (
          fieldId && <p>{records[recordIndex].fields[fieldId]}</p>
        )}
      </div>
      <Moveable
        // options
        preventDefault={false}
        flushSync={flushSync}
        target={targetRef} // move拖拽对象
        origin={false} // 显示中心点
        keepRatio={false} // 保持宽高
        edge={false} //
        draggable={settingModal} // 开启拖砖
        resizable={settingModal} // 开启调整大小
        rotatable={settingModal} // 开启旋转
        throttleDrag={0}
        onRender={(e) => {
          console.log('onRender');
          e.target.style.cssText += e.cssText;
        }}
        onClick={() => {
          setEditingElement();
        }}
        onRenderEnd={(e) => {
          if (e.isDrag) {
            e.target.style.transform = `rotate(${radiansToDegrees(
              e.transformObject.rotate,
            )}deg)`;

            if (sourceType === sourceElementTypes.Base) {
              updatePrintElement({
                ...elementInfo,
                rotate: radiansToDegrees(e.transformObject.rotate),
                styles: {
                  ...styles,
                  left: left + e.transformObject.translate[0],
                  top: top + e.transformObject.translate[1],
                  width: parseInt(e.target.style.width),
                  height: parseInt(e.target.style.height),
                },
              });
            } else {
              updatePrintRecordElement({
                ...elementInfo,
                rotate: radiansToDegrees(e.transformObject.rotate),
                styles: {
                  ...styles,
                  left: left + e.transformObject.translate[0],
                  top: top + e.transformObject.translate[1],
                  width: parseInt(e.target.style.width),
                  height: parseInt(e.target.style.height),
                },
              });
            }
          }
        }}
      />
    </div>
  );
};
