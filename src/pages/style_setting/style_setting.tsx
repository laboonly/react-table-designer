import {
  useSelectElementInfoStore,
  usePrintElementListStore,
  textElementInputList,
  ImageElementInputList,
  IElementType,
  sourceElementTypes,
  usePrintRecordElementListStore,
} from '@/store';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';

export const StyleSetting: React.FC<React.PropsWithChildren> = () => {
  const { selectElementInfo, changeSelectElementInfo } =
    useSelectElementInfoStore((state: any) => state);

  const { updatePrintElement, deletePrintElement } = usePrintElementListStore(
    (state: any) => state,
  );

  const { updatePrintRecordElement, deletePrintRecordElement } =
    usePrintRecordElementListStore((state: any) => state);

  const inputList = useMemo(() => {
    switch (selectElementInfo.type) {
      case IElementType.Text:
        return textElementInputList;
      case IElementType.Image:
        return ImageElementInputList;
      default:
        return [];
    }
  }, [selectElementInfo]);

  const valueChange = (e: React.ChangeEvent, changeInfo: any) => {
    if (selectElementInfo.sourceType === sourceElementTypes.Table) {
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

  const deleteElement = (uuid: string) => {
    if (selectElementInfo.sourceType === sourceElementTypes.Table) {
      deletePrintRecordElement(uuid);
    } else {
      deletePrintElement(uuid);
    }
    changeSelectElementInfo({});
  };

  return (
    <div className="border-r-1 flex w-[280px] min-w-[200px] flex-col  border-gray-700 bg-[#fff] px-[10px] py-[20px]">
      {selectElementInfo.uuid && (
        <>
          <h2 className="mb-4">Element Setting</h2>
          <div>
            {inputList.map((item: string) => {
              switch (item) {
                case 'content':
                case 'src':
                  if (selectElementInfo.sourceType === sourceElementTypes.Table)
                    return null;
                  return (
                    <div key={item} className="mb-4 flex flex-col">
                      <label className="mb-2">{item}:</label>
                      <Textarea
                        value={selectElementInfo[item]}
                        disabled={!selectElementInfo.isEdit}
                        onChange={(e) =>
                          valueChange(e, { [item]: e.target.value })
                        }
                      />
                    </div>
                  );
                case 'width':
                case 'height':
                case 'top':
                case 'left':
                case 'fontSize':
                  return (
                    <div key={item} className="mb-4 flex flex-col">
                      <label className="mb-2">{item}: </label>
                      <Input
                        type="number"
                        disabled={!selectElementInfo.isEdit}
                        value={selectElementInfo.styles[item]}
                        onChange={(e) =>
                          valueChange(e, {
                            styles: {
                              ...selectElementInfo.styles,
                              [item]: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  );
                case 'color':
                  return (
                    <div key={item} className="mb-4 flex flex-col">
                      <label className="mb-2">{item}: </label>
                      <Input
                        type="color"
                        disabled={!selectElementInfo.isEdit}
                        value={selectElementInfo.styles[item]}
                        onChange={(e) =>
                          valueChange(e, {
                            styles: {
                              ...selectElementInfo.styles,
                              [item]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  );
              }
            })}
            <Button
              className="w-[100%] justify-start"
              variant="outline"
              onClick={() => deleteElement(selectElementInfo.uuid)}
            >
              Delete Element
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
