import {
  useSelectElementInfoStore,
  usePrintElementListStore,
  textElementInputList,
} from '@/store';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export const StyleSetting: React.FC<React.PropsWithChildren> = () => {
  const { selectElementInfo, changeSelectElementInfo } =
    useSelectElementInfoStore((state: any) => state);

  const { updatePrintElement } = usePrintElementListStore(
    (state: any) => state,
  );

  const inputList = textElementInputList;

  const valueChange = (e: React.ChangeEvent, changeInfo: any) => {
    updatePrintElement({
      ...selectElementInfo,
      ...changeInfo,
    });
    changeSelectElementInfo({
      ...selectElementInfo,
      ...changeInfo,
    });
  };

  console.log('selectElementInfo--->', selectElementInfo);

  return (
    <div className="border-r-1 flex w-[280px] flex-col border-gray-700  bg-[#fff] px-2 py-10">
      <h2 className="mb-4">Element Setting</h2>
      <div>
        {selectElementInfo.uuid &&
          inputList.map((item: string) => {
            switch (item) {
              case 'content':
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
                      type="text"
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
      </div>
    </div>
  );
};
