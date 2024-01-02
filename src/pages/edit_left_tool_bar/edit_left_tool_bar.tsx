import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Save, UploadThree, Clear } from '@icon-park/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  IPrintElementListType,
  usePrintElementListStore,
  usePrintRecordElementListStore,
  IPrintRecordElementListType,
  IBaseElementType,
  ITableRecordDataStoreType,
  useTableRecordData,
} from '@/store';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { sourceElementTypes } from '@/store/constants';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

export const EditLeftToolBar = () => {
  const [fileName, setFileName] = useState<string>();
  const [templateFile, setTemplateFile] = useState<{
    printList: IBaseElementType[];
  }>();

  const { printRecordList, resetPrintRecordList } =
    usePrintRecordElementListStore(
      (state: IPrintRecordElementListType) => state,
    );

  const { printList, resetPrintElement, importPrintElement } =
    usePrintElementListStore((state: IPrintElementListType) => state);

  const { recordIndex, records } = useTableRecordData(
    (state: ITableRecordDataStoreType) => state,
  );

  const { t } = useTranslation();

  const exportTemplate = () => {
    const transformRecordList = printRecordList.map((item) => {
      return {
        ...item,
        sourceType: sourceElementTypes.Base,
        content: records[recordIndex].fields[item.fieldId!],
      };
    });

    const template = {
      printList: [...printList, ...transformRecordList],
    };

    const blob = new Blob([JSON.stringify(template)], {
      type: 'application/json',
    });
    saveAs(blob, fileName);
  };

  const importTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        if (!e.target) return;
        const content = e.target.result as string;
        try {
          const jsonData = JSON.parse(content);
          console.log('jsonData', jsonData);
          setTemplateFile(jsonData);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      // 读取文件内容
      reader.readAsText(file);
    }
  };

  const confirmedImport = () => {
    console.log('templateFile--->', templateFile);
    if (templateFile) {
      importPrintElement(templateFile.printList);
    }
  };

  const clearAllElement = () => {
    resetPrintRecordList();
    resetPrintElement();
  };

  return (
    <div className="border-1 flex w-[30] flex-col space-y-4 pl-[20px] pt-[20px]">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Save theme="outline" size="24" fill="#333" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t('save_template')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('save_template')}</DialogTitle>
            <DialogDescription>{t('save_template_content')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('file_name')}
              </Label>
              <Input
                id="name"
                defaultValue={fileName}
                value={fileName}
                className="col-span-3"
                onChange={(e) => {
                  setFileName(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={exportTemplate}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <UploadThree theme="outline" size="24" fill="#333" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t('import_template')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('import_template')}</DialogTitle>
            <DialogDescription>
              {t('import_template_content')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('file_name')}
              </Label>
              <Input
                id="file"
                className="col-span-3"
                type="file"
                onChange={(e) => importTemplate(e)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={confirmedImport}>
                {t('confirmed')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" size="icon">
                <Clear
                  theme="outline"
                  size="24"
                  fill="#333"
                  onClick={() => clearAllElement()}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{t('clear_all_element')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
