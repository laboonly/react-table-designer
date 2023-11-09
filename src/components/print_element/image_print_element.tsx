import {
  useSelectElementInfoStore,
  IBaseElementType,
  usePrintElementListStore,
  useSettingModalStore,
  IPrintElementListType,
  ISelectElementInfoType,
  ISettingModalType,
} from '@/store';
import { Rnd } from 'react-rnd';

interface IImagePropsType {
  elementInfo: IBaseElementType;
}

export const ImagePrintElement: React.FC<
  React.PropsWithChildren<IImagePropsType>
> = (props) => {
  const { elementInfo } = props;
  const { src, styles, uuid } = elementInfo;
  const { width = 200, height = 60, top, left } = styles;

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
    changeSelectElementInfo({
      ...elementInfo,
      isEdit: true,
    });
  };

  return (
    <Rnd
      id={uuid}
      default={{ x: left as number, y: top as number, width, height }}
      size={{ width: (width as number) + 10, height: (height as number) + 10 }}
      position={{ x: left as number, y: top as number }}
      onDragStop={(_, d) => {
        updatePrintElement({
          ...elementInfo,
          styles: {
            ...styles,
            left: d.x,
            top: d.y,
          },
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updatePrintElement({
          ...elementInfo,
          styles: {
            ...styles,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
          },
        });
      }}
      style={{
        border: settingModal ? '1px solid #ddd' : 'none',
        // padding: '10px 10px',
        cursor: 'move',
      }}
      onClick={setEditingElement}
    >
      <img className="w-full h-full rounded-none" src={src} draggable="false" />
    </Rnd>
  );
};
