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
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import {
  IPrintElementListType,
  usePrintElementListStore,
  usePrintRecordElementListStore,
  IPrintRecordElementListType,
  IBaseElementType,
} from '@/store';

export const EditToolBar = () => {
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

  const exportTemplate = () => {
    const template = {
      printList,
      printRecordList,
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
    <div className="border-1 flex justify-between border-gray-200 bg-[#fff] px-[20px] py-[8px]">
      <div className="flex justify-start space-x-4">
        <div className="flex justify-start">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Save template</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Save template</DialogTitle>
                <DialogDescription>
                  Make changes to your profile name here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    File Name
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
                  Save template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Import template</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Import template</DialogTitle>
                <DialogDescription>
                  Import to your template here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    File Name
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
                    Import template
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" onClick={clearAllElement}>
            Clear all element
          </Button>
        </div>
      </div>
    </div>
  );
};
