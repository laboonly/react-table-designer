import { Button } from '@/components/ui/button';
import { Pencil2Icon, CameraIcon } from '@radix-ui/react-icons';
import {
  useSettingModalStore,
  useSelectElementInfoStore,
  ISelectElementInfoType,
  ISettingModalType,
  usePaperSizeStore,
  IPaperSizeModalType,
  PaperSize,
  IWordTemplatesType,
  useWordTemplates,
} from '@/store';
import { useReactToPrint } from 'react-to-print';
import { useCallback } from 'react';
import { paperSizeList } from '@/store';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Translate } from '@icon-park/react';

interface IToolBarProps {
  printRef?: React.RefObject<HTMLDivElement>;
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

  const { t, i18n } = useTranslation();

  const { paperSize } = usePaperSizeStore(
    (state: IPaperSizeModalType) => state,
  );

  const { wordTemplateModal, setWordTemplateModal } = useWordTemplates(
    (state: IWordTemplatesType) => state,
  );

  const reactToPrintContent = useCallback(() => {
    if (!printRef) return null;
    return printRef.current;
  }, [printRef]);

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

  const lngs: { [key: string]: { nativeName: string } } = {
    en: { nativeName: 'English' },
    zh: { nativeName: '中文' },
  };

  return (
    <div className="mx-[16px] flex justify-between justify-items-center border-b-2 border-gray-400 py-[8px]">
      <h1 className="leading-[36px]">{t('title')}</h1>
      <div className="flex justify-end space-x-4">
        <Button
          variant="ghost"
          onClick={() => setWordTemplateModal(!wordTemplateModal)}
        >
          {!wordTemplateModal ? t('word_template') : t('designer_modal')}
        </Button>
        {!wordTemplateModal && (
          <Button variant="ghost" onClick={() => setSeettingModal()}>
            <Pencil2Icon className="w-4.h mr-2" />
            {settingModal ? t('cancel_edit_layout') : t('edit_layout')}
          </Button>
        )}
        {/* <Button variant="ghost">
          <PlayIcon className="w-4.h mr-2" />
          {t('present')}
        </Button> */}
        {!wordTemplateModal && (
          <Button variant="ghost" onClick={() => handlePrint()}>
            <CameraIcon className="w-4.h mr-2" />
            {t('print')}
          </Button>
        )}
        <div>
          <Select
            onValueChange={(value) => i18n.changeLanguage(value)}
            defaultValue={i18n.language}
          >
            <SelectTrigger>
              <Translate theme="outline" size="22" fill="#333" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(lngs).map((lng) => {
                return (
                  <SelectItem key={lng} value={lng}>
                    {lngs[lng].nativeName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
