import { TextElement, ImageElement } from '@/components/base_element';
import {
  useTableRecordData,
  useTableFieldData,
  ITableRecordDataStoreType,
  ITableFieldDataStoreType,
} from '@/store';
import {
  sourceElementTypes,
  textContentFieldType,
  attachmentContentFieldType,
} from '@/store/constants';

export const RecordElementContent = () => {
  const { recordIds } = useTableRecordData(
    (state: ITableRecordDataStoreType) => state,
  );

  const { fieldMap, fieldIds } = useTableFieldData(
    (state: ITableFieldDataStoreType) => state,
  );

  return (
    <div className="flex flex-col space-y-4">
      {recordIds.length > 0 &&
        fieldMap.size > 0 &&
        fieldIds.map((item: string, index: number) => {
          const field = fieldMap.get(item);
          if (!field?.id) return null;
          if (textContentFieldType.includes(field.type)) {
            return (
              <TextElement
                key={index}
                content={field?.name}
                fieldId={field?.id}
                sourceType={sourceElementTypes.Table}
                fieldType={field.type}
              />
            );
          }
          if (attachmentContentFieldType.includes(field.type)) {
            return (
              <ImageElement
                key={index}
                content={field?.name}
                fieldId={field?.id}
                sourceType={sourceElementTypes.Table}
              />
            );
          }
        })}
    </div>
  );
};
