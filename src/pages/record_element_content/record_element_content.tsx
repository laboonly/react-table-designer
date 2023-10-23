import { TextElement } from '@/components/base_element';
import { useTableRecordData, useTableFieldData } from '@/store';
import { sourceElementTypes, textfeildType } from '@/store/constants';
import { getQueryParamsString } from '@/lib/utils';
import axios from 'axios';
import { useEffect } from 'react';
import { getTableRecordsData, getTablefieldsData } from '@/api';

export const RecordElementContent = () => {
  const { recordIndex, records, setTableRecordsData } = useTableRecordData(
    (state: any) => state,
  );

  const { fieldMap, setTableFieldData } = useTableFieldData(
    (state: any) => state,
  );

  useEffect(() => {
    const tableId = getQueryParamsString('tableid');
    const viewId = getQueryParamsString('viewid');
    if (!tableId || !viewId) return;
    axios.defaults.headers.common['Authorization'] =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcmZ3RzdIc3NCd1giLCJpYXQiOjE2OTc3OTgyOTgsImV4cCI6MTY5OTUyNjI5OH0.cpxWVRFz0k5yF-DX5nD1LmYQyi26FXfxrfNiowA_4j8';
    getTableRecordsData(tableId, viewId).then((res: any) => {
      setTableRecordsData(res.data.records);
    });

    getTablefieldsData(tableId, viewId).then((res: any) => {
      const fields = res.data;
      const fieldMap = new Map();
      fields.forEach((item: any) => {
        fieldMap.set(item.id, item);
      });
      setTableFieldData(fieldMap);
    });
  }, [setTableRecordsData, setTableFieldData]);

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
