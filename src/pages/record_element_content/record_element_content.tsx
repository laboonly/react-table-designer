import { TextElement } from '@/components/base_element';
import { useTableRecordData, useTableFieldData } from '@/store';
import { sourceElementTypes, textfeildType } from '@/store/constants';

export const RecordElementContent = () => {
  const { recordIndex, records } = useTableRecordData((state: any) => state);

  const { fieldMap } = useTableFieldData((state: any) => state);

  return (
    <div className="flex flex-col space-y-4">
      {records.length > 0 &&
        fieldMap.size > 0 &&
        Object.keys(records[recordIndex].fields).map(
          (item: any, index: number) => {
            const field = fieldMap.get(item);
            if (textfeildType.includes(field.type)) {
              return (
                <TextElement
                  key={index}
                  content={field.name}
                  fieldId={field.id}
                  sourceType={sourceElementTypes.Table}
                />
              );
            }
            return null;
          },
        )}
    </div>
  );
};
