import { Button } from '@/components/ui/button';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  Pencil2Icon,
  PlayIcon,
  CameraIcon,
} from '@radix-ui/react-icons';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useSettingModalStore, useSelectElementInfoStore } from '@/store';

export const ToolBar = () => {
  const { settingModal, changeSettingModal } = useSettingModalStore(
    (state: any) => state,
  );
  const { selectElementInfo, changeSelectElementInfo } =
    useSelectElementInfoStore((state: any) => state);

  const setSeettingModal = () => {
    changeSettingModal();

    changeSelectElementInfo({
      ...selectElementInfo,
      isEdit: !settingModal,
    });
  };

  return (
    <div className="mx-[16px] flex justify-between border-b-2 border-gray-400 py-[8px]">
      <div className="flex justify-start space-x-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">base View</SelectItem>
            <SelectItem value="dark">Grid View</SelectItem>
            <SelectItem value="system">Gantt View</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex justify-start">
          <Button variant="ghost">
            <ChevronLeftIcon className="w-4.h" />
            Next Rcord
          </Button>
          <Button variant="ghost">
            Next Rcord
            <ChevronRightIcon className="w-4.h" />
          </Button>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="ghost" onClick={() => setSeettingModal()}>
          <Pencil2Icon className="w-4.h mr-2" />
          {settingModal ? 'Cancel Edit Layput' : 'Edit Layout'}
        </Button>
        <Button variant="ghost">
          <PlayIcon className="w-4.h mr-2" />
          Present
        </Button>
        <Button variant="ghost">
          <CameraIcon className="w-4.h mr-2" />
          Print
        </Button>
      </div>
    </div>
  );
};
