import { Button } from '@/components/ui/button';
import { Pencil2Icon, PlayIcon, CameraIcon } from '@radix-ui/react-icons';

import {
  useSettingModalStore,
  useSelectElementInfoStore,
  ISelectElementInfoType,
  ISettingModalType,
  usePaperSizeStore,
  IPaperSizeModalType,
  PaperSize,
} from '@/store';
import { useReactToPrint } from 'react-to-print';
import { useCallback } from 'react';
import { paperSizeList } from '@/store';

interface IToolBarProps {
  printRef: React.RefObject<HTMLDivElement>;
}

export const ToolBar = (props: IToolBarProps) => {
  const { printRef } = props;
  const { settingModal, changeSettingModal, closeSettingModal } =
    useSettingModalStore((state: ISettingModalType) => state);
  const { selectElementInfo, changeSelectElementInfo } =
    useSelectElementInfoStore((state: ISelectElementInfoType) => state);

  const setSeettingModal = () => {
    changeSettingModal();

    if (!selectElementInfo) return;
    changeSelectElementInfo({
      ...selectElementInfo,
      isEdit: !settingModal,
    });
  };

  const { paperSize } = usePaperSizeStore(
    (state: IPaperSizeModalType) => state,
  );

  const reactToPrintContent = useCallback(() => {
    return printRef.current;
  }, [printRef.current]);

  const print = useReactToPrint({
    content: reactToPrintContent,
    pageStyle: `@page {size: ${paperSizeList[paperSize as PaperSize].width} ${
      paperSizeList[paperSize as PaperSize].height
    };}`,
  });

  const handlePrint = () => {
    closeSettingModal();
    queueMicrotask(() => {
      print();
    });
  };

  return (
    <div className="mx-[16px] flex justify-between border-b-2 border-gray-400 py-[8px]">
      <div className="flex justify-end space-x-4">
        <Button variant="ghost" onClick={() => setSeettingModal()}>
          <Pencil2Icon className="w-4.h mr-2" />
          {settingModal ? 'Cancel Edit Layout' : 'Edit Layout'}
        </Button>
        <Button variant="ghost">
          <PlayIcon className="w-4.h mr-2" />
          Present
        </Button>

        <Button variant="ghost" onClick={() => handlePrint()}>
          <CameraIcon className="w-4.h mr-2" />
          Print
        </Button>
      </div>
    </div>
  );
};
