import {
  useSelectElementInfoStore,
  IBaseElementType,
  usePrintElementListStore,
  useSettingModalStore,
} from '@/store';
import { Textarea } from '@/components/ui/textarea';
import { Rnd } from 'react-rnd';

interface ITextPropsType {
  elementInfo: IBaseElementType;
}

export const TextPrintElement: React.FC<
  React.PropsWithChildren<ITextPropsType>
> = (props) => {
  const { elementInfo } = props;
  const { content, styles, uuid } = elementInfo;
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
      disableDragging={selectElementInfo.isEdit}
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
        wordWrap: 'break-word',
        textAlign: 'left',
        color: styles.color,
        fontSize: styles.fontSize,
      }}
      onClick={setEditingElement}
    >
      {/* <div
        style={{
          width: '100%',
          height: '100%',
        }}
      > */}
      {isElementEdit ? (
        <Textarea
          style={{ padding: '0px 0px', fontSize: styles.fontSize }}
          value={content}
          onChange={(e) => valueChange(e)}
          className="h-full w-full rounded-none"
        />
      ) : (
        <p>{content}</p>
      )}
      {/* </div> */}
    </Rnd>
  );
};
