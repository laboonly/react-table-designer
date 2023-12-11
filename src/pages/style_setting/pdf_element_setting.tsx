import {
  IBaseElementType,
  IPrintElementListType,
  usePrintElementListStore,
  useSelectElementInfoStore,
  ISelectElementInfoType,
} from '@/store';
import { Input } from '@/components/ui/input';
import { ChangeEvent } from 'react';

interface IPdfElementSettingProps {
  selectElementInfo: IBaseElementType;
}

export const PdfElementSetting: React.FC<IPdfElementSettingProps> = (props) => {
  const { selectElementInfo } = props;

  const { updatePrintElement } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
  );

  const { changeSelectElementInfo } = useSelectElementInfoStore(
    (state: ISelectElementInfoType) => state,
  );

  const handFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e: ProgressEvent<FileReader>) {
      if (!e.target) return;
      const content = e.target.result as string;
      const pdfBase64 = btoa(content);

      // 将 Base64 编码的 PDF 数据存储在 JSON 对象中
      const pdfObject = { pdfData: pdfBase64 };

      try {
        updatePrintElement({
          ...selectElementInfo,
          pdfFile: pdfObject,
        });
        changeSelectElementInfo({
          ...selectElementInfo,
          pdfFile: pdfObject,
        });
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    // 读取文件内容
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <Input type="file" onChange={handFileChange} accept=".pdf" />
    </div>
  );
};
