import {
  useSelectElementInfoStore,
  IBaseElementType,
  usePrintElementListStore,
  useSettingModalStore,
} from '@/store';
import { Rnd } from 'react-rnd';
import { Textarea } from '@/components/ui/textarea';

interface IImagePropsType {
  elementInfo: IBaseElementType;
}

export const ImagePrintElement: React.FC<
  React.PropsWithChildren<IImagePropsType>
> = (props) => {
  const { elementInfo } = props;
  const { src, styles, uuid } = elementInfo;
  const { width = 200, height = 60, top, left } = styles;

  const { selectElementInfo, changeSelectElementInfo } =
    useSelectElementInfoStore((state: any) => state);

  const settingModal = useSettingModalStore((state: any) => state.settingModal);
  const { updatePrintElement } = usePrintElementListStore(
    (state: any) => state,
  );
  const isElementEdit =
    selectElementInfo.uuid === uuid && selectElementInfo.isEdit;

  const setEditingElement = () => {
    changeSelectElementInfo({
      ...elementInfo,
      isEdit: true,
    });
  };

  const valueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updatePrintElement({
      ...elementInfo,
      src: e.target.value,
    });
    changeSelectElementInfo({
      ...elementInfo,
      isEdit: true,
      src: e.target.value,
    });
  };

  return (
    <Rnd
      id={uuid}
      default={{ x: left as number, y: top as number, width, height }}
      size={{ width: (width as number) + 10, height: (height as number) + 10 }}
      disableDragging={isElementEdit}
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
      {isElementEdit && (
        <Textarea
          style={{
            position: 'absolute',
            padding: '0px 0px',
            fontSize: styles.fontSize,
          }}
          value={src}
          onChange={(e) => valueChange(e)}
          className="h-full w-full rounded-none"
        />
      )}
      <img className="h-full w-full rounded-none" src={src} />
    </Rnd>
  );
};
