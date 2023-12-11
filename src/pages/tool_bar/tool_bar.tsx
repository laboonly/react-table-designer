import { Button } from '@/components/ui/button';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  Pencil2Icon,
  PlayIcon,
  CameraIcon,
} from '@radix-ui/react-icons';

import {
  useSettingModalStore,
  useSelectElementInfoStore,
  useTableRecordData,
  ISelectElementInfoType,
  ITableRecordDataStoreType,
  ISettingModalType,
} from '@/store';
import { useReactToPrint } from 'react-to-print';
import { useCallback } from 'react';

interface IToolBarProps {
  printRef: React.RefObject<HTMLDivElement>;
}

export const ToolBar = (props: IToolBarProps) => {
  const { printRef } = props;
  const { settingModal, changeSettingModal } = useSettingModalStore(
    (state: ISettingModalType) => state,
  );
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

  const { recordIndex, setRecordIndex, recordsTotal } = useTableRecordData(
    (state: ITableRecordDataStoreType) => state,
  );

  const canNext = recordIndex < recordsTotal - 1;
  const canPre = recordIndex > 0;

  const nextRecord = () => {
    if (recordIndex < recordsTotal - 1) {
      setRecordIndex(recordIndex + 1);
    }
  };

  const preRecord = () => {
    if (recordIndex > 0) {
      setRecordIndex(recordIndex - 1);
    }
  };
  const reactToPrintContent = useCallback(() => {
    console.log('printRef.current---->', printRef.current);
    return printRef.current;
  }, [printRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    onBeforeGetContent: () => {
      console.log('reactToPrintContent--->', printRef.current);
    },
    pageStyle: '@page { size: 210mm 296mm; }',
  });

  return (
    <div className="mx-[16px] flex justify-between border-b-2 border-gray-400 py-[8px]">
      <div className="flex justify-start space-x-4">
        <Button variant="ghost" disabled={!canPre} onClick={() => preRecord()}>
          <ChevronLeftIcon className="w-4.h" />
          Previous Record
        </Button>
        <Button
          variant="ghost"
          disabled={!canNext}
          onClick={() => nextRecord()}
        >
          Next Record
          <ChevronRightIcon className="w-4.h" />
        </Button>
      </div>
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
