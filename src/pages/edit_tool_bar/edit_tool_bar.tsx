import { Label } from '@/components/ui/label';
import { usePaperSizeStore, IPaperSizeModalType } from '@/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { paperSizeList } from '@/store/constants';

export const EditToolBar = () => {
  const { paperSize, changePaperSize } = usePaperSizeStore(
    (state: IPaperSizeModalType) => state,
  );

  return (
    <div className="border-1 flex justify-end border-gray-200 bg-[#fff] px-[20px] py-[8px]">
      <div className="flex justify-start space-x-4">
        <div className="flex justify-start">
          <div className="flex w-[200px] items-center ">
            <Label className="w-[150px]">Paper size: </Label>
            <Select
              onValueChange={(value) => changePaperSize(value)}
              defaultValue={paperSize}
            >
              <SelectTrigger>
                <SelectValue placeholder="Text Align" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {Object.keys(paperSizeList).map((value) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
