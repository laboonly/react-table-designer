import {
  useSelectElementInfoStore,
  IBaseElementType,
  usePrintElementListStore,
  useSettingModalStore,
  IPrintElementListType,
  ISelectElementInfoType,
  ISettingModalType,
  sourceElementTypes,
  IPrintRecordElementListType,
  usePrintRecordElementListStore,
} from '@/store';
import Moveable from 'react-moveable';
import { flushSync } from 'react-dom';
import { useRef } from 'react';
import { radiansToDegrees } from '@/lib/utils';
import logo from '../../assets/images/logo.svg';

interface IImagePropsType {
  elementInfo: IBaseElementType;
}

export const ImagePrintElement: React.FC<
  React.PropsWithChildren<IImagePropsType>
> = (props) => {
  const { elementInfo } = props;
  const { src, styles, uuid, sourceType, rotate } = elementInfo;
  const { width = 200, height = 60, top, left } = styles;

  const targetRef = useRef<HTMLImageElement>(null);
  const moveableRef = useRef<Moveable>(null);

  const { changeSelectElementInfo } = useSelectElementInfoStore(
    (state: ISelectElementInfoType) => state,
  );

  const settingModal = useSettingModalStore(
    (state: ISettingModalType) => state.settingModal,
  );
  const { updatePrintElement } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
  );

  const { updatePrintRecordElement } = usePrintRecordElementListStore(
    (state: IPrintRecordElementListType) => state,
  );

  const setEditingElement = () => {
    if (!settingModal) return;
    changeSelectElementInfo({
      ...elementInfo,
      isEdit: true,
    });
  };

  if (!uuid) return <></>;
  return (
    <div
      id={uuid}
      className="printElement"
      style={{
        position: 'absolute',
        top,
        left,
      }}
    >
      <div
        ref={targetRef}
        style={{
          position: 'relative',
          width: width,
          height: height,
          backgroundImage: `url(${src === '' ? logo : src})`,
          backgroundPosition: 'center center',
          backgroundSize: '100% 100%',
          transform: `rotate(${rotate}deg)`,
          border: settingModal ? '1px dashed #020617' : 'none',
        }}
      />
      <Moveable
        // options
        flushSync={flushSync}
        ref={moveableRef}
        // container={document.getElementById('print')}
        target={targetRef} // move拖拽对象
        origin={false} // 显示中心点
        keepRatio={false} // 保持宽高
        edge={false} //
        draggable={settingModal} // 开启拖砖
        resizable={settingModal} // 开启调整大小
        rotatable={settingModal} // 开启旋转
        useMutationObserver={true}
        zoom={settingModal ? 1 : 0}
        throttleDrag={0}
        snappable={true}
        snapDirections={{ top: true, left: true, bottom: false, right: false }}
        verticalGuidelines={[50, 150, 250, 450, 550]}
        horizontalGuidelines={[0, 100, 200, 400, 500]}
        hideDefaultLines={true}
        elementGuidelines={['.guideLine']}
        padding={{
          left: 5,
          right: 5,
          top: 5,
          bottom: 5,
        }}
        onRender={(e) => {
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
