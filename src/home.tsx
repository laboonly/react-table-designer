import { Print } from './pages/print/print';
import { ToolBar } from './pages/tool_bar';
import { StyleSetting } from './pages/style_setting';
import {
  useSettingModalStore,
  usePrintAreaPosition,
  useTableFieldData,
  useTableRecordData,
  ISettingModalType,
  ITableRecordDataStoreType,
  ITableFieldDataStoreType,
  IPrintAreaPositionStoreType,
  IRecordsData,
  IFieldsType,
} from './store';
import { BaseElementsContent } from './pages/elements_content/base_element_content';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useWindowSize, useScroll } from 'react-use';
import { RecordElementContent } from './pages/record_element_content';
import { useEffect, useRef } from 'react';
import { getQueryParamsString } from '@/lib/utils';
import axios from 'axios';
import { getTableRecordsData, getTablefieldsData } from '@/api';

export const Home = () => {
  const settingModal = useSettingModalStore(
    (state: ISettingModalType) => state.settingModal,
  );
  const printRef = useRef<HTMLDivElement>(null);
  const { setPrintAreaPosition } = usePrintAreaPosition(
    (state: IPrintAreaPositionStoreType) => state,
  );
  const { width, height } = useWindowSize();
  const { x: scrollLeft, y: scrollTop } = useScroll(printRef);

  const { setTableRecordsData } = useTableRecordData(
    (state: ITableRecordDataStoreType) => state,
  );

  const { setTableFieldData } = useTableFieldData(
    (state: ITableFieldDataStoreType) => state,
  );

  useEffect(() => {
    const tableId = getQueryParamsString('tableid');
    const viewId = getQueryParamsString('viewid');
    if (!tableId || !viewId) return;
    axios.defaults.headers.common['Authorization'] =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcmZ3RzdIc3NCd1giLCJpYXQiOjE2OTk0MzA2MTQsImV4cCI6MTcwMTE1ODYxNH0.Bt230FO_RzXT0wMWExFRWeKnJvz_-_7jU9FzEKnjseE';
    getTableRecordsData(tableId, viewId).then(
      (res: { data: { records: IRecordsData[] } }) => {
        setTableRecordsData(res.data.records);
      },
    );

    getTablefieldsData(tableId, viewId).then((res: { data: IFieldsType[] }) => {
      const fields = res.data;
      const fieldMap = new Map();
      fields.forEach((item: IFieldsType) => {
        fieldMap.set(item.id, item);
      });
      setTableFieldData(fieldMap);
    });
  }, [setTableRecordsData, setTableFieldData]);

  useEffect(() => {
    if (printRef.current) {
      const { offsetTop, offsetLeft } = printRef.current;
      console.log(offsetTop, offsetLeft, scrollTop, scrollLeft);
      setPrintAreaPosition({
        top: offsetTop,
        left: offsetLeft,
        scrollTop,
        scrollLeft,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, scrollLeft, scrollTop]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen">
        <div className="fixed z-50 w-full bg-[#fff]">
          <ToolBar printRef={printRef} />
        </div>
        <div className="flex h-full justify-start bg-gray-100 pt-[54px]">
          {settingModal && (
            <div className="border-r-1 flex w-[280px] min-w-[200px] flex-col  border-gray-700 bg-[#fff] px-2 py-[20px]">
              <div className="h-[300px]">
                <h2 className="mb-4">Static elements</h2>
                <BaseElementsContent />
              </div>
              <div className="flex flex-col">
                <h2 className="mb-4">Fields from your table data</h2>
                <RecordElementContent />
              </div>
            </div>
          )}
          <div className="h-full grow">
            <Print printRef={printRef} />
          </div>
          {settingModal && <StyleSetting />}
        </div>
      </div>
    </DndProvider>
  );
};
