import {
  useSelectElementInfoStore,
  IBaseElementType,
  usePrintElementListStore,
  useSettingModalStore,
  IPrintElementListType,
  ISelectElementInfoType,
  ISettingModalType,
} from '@/store';
import Moveable from 'react-moveable';
import { flushSync } from 'react-dom';
import { useRef } from 'react';
import { radiansToDegrees } from '@/lib/utils';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface IPdfPropsType {
  elementInfo: IBaseElementType;
}

export const PdfPrintElement: React.FC<
  React.PropsWithChildren<IPdfPropsType>
> = (props) => {
  const { elementInfo } = props;
  const { styles, uuid, rotate, pdfFile } = elementInfo;
  const { width = 200, height = 60, top, left } = styles;

  const targetRef = useRef<HTMLImageElement>(null);

  const { changeSelectElementInfo } = useSelectElementInfoStore(
    (state: ISelectElementInfoType) => state,
  );

  const settingModal = useSettingModalStore(
    (state: ISettingModalType) => state.settingModal,
  );
  const { updatePrintElement } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
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
          transform: `rotate(${rotate}deg)`,
          textAlign: 'center',
          border: settingModal ? '1px dashed #020617' : 'none',
        }}
      >
        {pdfFile?.pdfData ? (
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <Viewer
              key={width}
              fileUrl={`data:application/pdf;base64,${pdfFile.pdfData}`}
            />
          </Worker>
        ) : (
          <p>please upload pdf file</p>
        )}
      </div>
      <Moveable
        // options
        flushSync={flushSync}
        target={targetRef} // move拖拽对象
        origin={false} // 显示中心点
        keepRatio={false} // 保持宽高
        edge={false} //
        draggable={settingModal} // 开启拖砖
        resizable={settingModal} // 开启调整大小
        rotatable={false} // 开启旋转
        useMutationObserver={true}
        zoom={settingModal ? 1 : 0}
        throttleDrag={0}
        hideDefaultLines={true}
        renderDirections={['se', 'sw', 'nw', 'ne']}
        padding={{
          left: 5,
          right: 5,
          top: 5,
          bottom: 5,
        }}
        onRender={(e) => {
          console.log('onRender');
          e.target.style.cssText += e.cssText;
        }}
        onClick={() => {
          setEditingElement();
        }}
        onRenderEnd={(e) => {
          console.log(
            'onRenderEnd',
            e,
            e.clientX,
            e.clientY,
            left + e.transformObject.translate[0],
            top + e.transformObject.translate[1],
          );
          if (e.isDrag) {
            e.target.style.transform = `rotate(${radiansToDegrees(
              e.transformObject.rotate,
            )}deg)`;

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
          }
        }}
      />
    </div>
  );
};
