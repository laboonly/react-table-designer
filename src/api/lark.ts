import { bitable, IAttachmentField } from '@lark-base-open/js-sdk';

export const getCellValueToString = async (
  fieldId: string,
  recordId: string,
  type: number,
) => {
  console.log('type--->', type);
  const table = await bitable.base.getActiveTable();
  const field = await table.getField(fieldId);
  const cellValue = await field.getCellString(recordId);
  console.log('cellValue---->', cellValue);
  return cellValue;
};

export const getAttachmentUrl = async (fieldId: string, recordId: string) => {
  const table = await bitable.base.getActiveTable();
  const attachmentField = await table.getField<IAttachmentField>(fieldId);
  const urls = await attachmentField.getAttachmentUrls(recordId);
  console.log(urls);
  return urls[0];
};