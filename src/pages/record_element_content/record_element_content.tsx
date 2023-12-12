import { TextElement } from '@/components/base_element';
import {
  useTableRecordData,
  useTableFieldData,
  ITableRecordDataStoreType,
  ITableFieldDataStoreType,
} from '@/store';
import { sourceElementTypes, textFieldType } from '@/store/constants';

export const RecordElementContent = () => {
  const { recordIndex, records } = useTableRecordData(
    (state: ITableRecordDataStoreType) => state,
  );

  const { fieldMap } = useTableFieldData(
    (state: ITableFieldDataStoreType) => state,
  );

  return (
    <div className="flex flex-col space-y-4">
      {records.length > 0 &&
        fieldMap.size > 0 &&
        Object.keys(records[recordIndex].fields).map(
          (item: string, index: number) => {
            const field = fieldMap.get(item);
            if (field && textFieldType.includes(field?.type)) {
              return (
                <TextElement
                  key={index}
                  content={field?.name}
                  fieldId={field?.id}
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
