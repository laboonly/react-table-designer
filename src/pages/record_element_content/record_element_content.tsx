import { TextElement, ImageElement } from '@/components/base_element';
import {
  useTableRecordData,
  useTableFieldData,
  ITableRecordDataStoreType,
  ITableFieldDataStoreType,
} from '@/store';
import { sourceElementTypes } from '@/store/constants';
import { FieldType } from '@lark-base-open/js-sdk';

export const RecordElementContent = () => {
  const { recordIds } = useTableRecordData(
    (state: ITableRecordDataStoreType) => state,
  );

  const { fieldMap, fieldIds } = useTableFieldData(
    (state: ITableFieldDataStoreType) => state,
  );

  const textFieldType = [
    FieldType.Text,
    FieldType.AutoNumber,
    FieldType.CreatedTime,
    FieldType.CreatedUser,
    FieldType.DateTime,
    FieldType.Email,
    FieldType.GroupChat,
    FieldType.ModifiedTime,
    FieldType.SingleSelect,
    FieldType.User,
    FieldType.SingleLink,
    FieldType.Number,
    FieldType.Phone,
    FieldType.MultiSelect,
  ];

  const attachment = [FieldType.Attachment];

  return (
    <div className="flex flex-col space-y-4">
      {recordIds.length > 0 &&
        fieldMap.size > 0 &&
        fieldIds.map((item: string, index: number) => {
          const field = fieldMap.get(item);
          if (!field?.id) return null;
          if (textFieldType.includes(field.type)) {
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
          if (attachment.includes(field.type)) {
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
