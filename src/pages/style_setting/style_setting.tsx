import {
  useSelectElementInfoStore,
  usePrintElementListStore,
  textElementInputList,
  ImageElementInputList,
  IElementType,
  sourceElementTypes,
  usePrintRecordElementListStore,
  IPrintElementListType,
  ISelectElementInfoType,
  IPrintRecordElementListType,
  fontSizeValue,
  lineHeightValue,
} from '@/store';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select';

export const StyleSetting: React.FC<React.PropsWithChildren> = () => {
  const { selectElementInfo, changeSelectElementInfo } =
    useSelectElementInfoStore((state: ISelectElementInfoType) => state);

  const { updatePrintElement, deletePrintElement } = usePrintElementListStore(
    (state: IPrintElementListType) => state,
  );

  const { updatePrintRecordElement, deletePrintRecordElement } =
    usePrintRecordElementListStore(
      (state: IPrintRecordElementListType) => state,
    );

  const inputList = useMemo(() => {
    if (!selectElementInfo) return [];
    switch (selectElementInfo.type) {
      case IElementType.Text:
        return textElementInputList;
      case IElementType.Image:
        return ImageElementInputList;
      default:
        return [];
    }
  }, [selectElementInfo]);

  const valueChange = (changeInfo: any) => {
    console.log('changeInfo', changeInfo);
    if (selectElementInfo?.sourceType === sourceElementTypes.Table) {
      updatePrintRecordElement({
        ...selectElementInfo,
        ...changeInfo,
      });
    } else {
      updatePrintElement({
        ...selectElementInfo,
        ...changeInfo,
      });
    }
    changeSelectElementInfo({
      ...selectElementInfo,
      ...changeInfo,
    });
  };

  const deleteElement = (uuid: string | undefined) => {
    if (!uuid) return;
    if (selectElementInfo?.sourceType === sourceElementTypes.Table) {
      deletePrintRecordElement(uuid);
    } else {
      deletePrintElement(uuid);
    }
    changeSelectElementInfo(null);
  };

  return (
    <div className="border-r-1 relative flex w-[280px] min-w-[200px] flex-col  border-gray-700 bg-[#fff] px-[10px] py-[20px]">
      {selectElementInfo?.uuid && (
        <>
          <h2 className="mb-4">Element Setting</h2>
          <div className="grid grid-cols-2 gap-4">
            {inputList.map((item: string) => {
              switch (item) {
                case 'content':
                case 'src':
                  if (selectElementInfo.sourceType === sourceElementTypes.Table)
                    return null;
                  return (
                    <div key={item} className="flex flex-col col-span-2 mb-4">
                      <Label className="mb-2 mr-4">{item}:</Label>
                      <Textarea
                        value={selectElementInfo[item]}
                        disabled={!selectElementInfo.isEdit}
                        onChange={(e) =>
                          valueChange({ [item]: e.target.value })
                        }
                      />
                    </div>
                  );
                case 'width':
                case 'height':
                case 'top':
                case 'left':
                  return (
                    <div key={item} className="flex flex-col mb-4">
                      <Label className="mb-2 mr-4">{item}: </Label>
                      <Input
                        type="number"
                        disabled={!selectElementInfo.isEdit}
                        value={selectElementInfo.styles[item]}
                        onChange={(e) =>
                          valueChange({
                            styles: {
                              ...selectElementInfo.styles,
                              [item]: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  );
                case 'fontSize':
                case 'lineHeight':
                  return (
                    <div key={item} className="flex flex-col mb-4">
                      <Label className="mb-2 mr-4">{item}: </Label>
                      <Select
                        disabled={!selectElementInfo.isEdit}
                        onValueChange={(value) =>
                          valueChange({
                            styles: {
                              ...selectElementInfo.styles,
                              [item]: value,
                            },
                          })
                        }
                        defaultValue={selectElementInfo.styles[item] as string}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Text Align" />
                        </SelectTrigger>
                        <SelectContent className="h-[200px]">
                          {item === 'fontSize'
                            ? fontSizeValue.map((value) => {
                                return (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                );
                              })
                            : lineHeightValue.map((value) => {
                                return (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                );
                              })}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                case 'color':
                  return (
                    <div key={item} className="flex flex-col mb-4">
                      <Label className="mb-2 mr-4">{item}: </Label>
                      <Input
                        type="color"
                        disabled={!selectElementInfo.isEdit}
                        value={selectElementInfo.styles[item]}
                        onChange={(e) =>
                          valueChange({
                            styles: {
                              ...selectElementInfo.styles,
                              [item]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  );
                case 'textAlign':
                  return (
                    <div key={item} className="flex flex-col mb-4">
                      <Label className="mb-2 mr-4">{item}: </Label>
                      <Select
                        disabled={!selectElementInfo.isEdit}
                        onValueChange={(value) =>
                          valueChange({
                            styles: {
                              ...selectElementInfo.styles,
                              [item]: value,
                            },
                          })
                        }
                        defaultValue={selectElementInfo.styles[item]}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Text Align" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
              }
            })}
          </div>
          <Button
            className="bottom-0 mt-20 w-[100%] justify-start"
            variant="outline"
            onClick={() => deleteElement(selectElementInfo.uuid)}
          >
            Delete Element
          </Button>
        </>
      )}
    </div>
  );
};
