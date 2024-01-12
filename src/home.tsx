import { Print } from './pages/print/print';
import { ToolBar } from './pages/tool_bar';
import { StyleSetting } from './pages/style_setting';
import { EditToolBar } from '@/pages/edit_tool_bar';
import { EditLeftToolBar } from '@/pages/edit_left_tool_bar';
import { RecordElementContent } from './pages/record_element_content';
import { BaseElementsContent } from './pages/elements_content/base_element_content';
import {
  useSettingModalStore,
  usePrintAreaPosition,
  ISettingModalType,
  IPrintAreaPositionStoreType,
  useTableRecordData,
  ITableRecordDataStoreType,
  IRecordsData,
  IFieldsType,
  useTableFieldData,
  ITableFieldDataStoreType,
} from './store';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useWindowSize, useScroll } from 'react-use';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { getQueryParamsString } from '@/lib/utils';
import axios from 'axios';
import { getTableRecordsData, getTablefieldsData } from '@/api';
import '@icon-park/react/styles/index.css';

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

  useEffect(() => {
    if (printRef.current) {
      setPrintAreaPosition({
        top: printRef.current.getBoundingClientRect().top,
        left: printRef.current.getBoundingClientRect().left,
        scrollTop,
        scrollLeft,
      });
    }
  }, [width, height, scrollLeft, scrollTop, setPrintAreaPosition]);

  const { recordIndex, setRecordIndex, recordsTotal, setTableRecordsData } =
    useTableRecordData((state: ITableRecordDataStoreType) => state);
  const canNext = recordIndex < recordsTotal - 1;
  const canPre = recordIndex > 0;

  const { setTableFieldData } = useTableFieldData(
    (state: ITableFieldDataStoreType) => state,
  );

  useEffect(() => {
    const tableId = getQueryParamsString('tableid');
    const viewId = getQueryParamsString('viewid');
    if (!tableId || !viewId) return;
    axios.defaults.headers.common['Authorization'] =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzcm43YjY3SUJUSzA1dTVZdmQiLCJpYXQiOjE3MDQxNzc5MDMsImV4cCI6MTcwNTkwNTkwM30.r3CEhUOG5lxZ372EABKHVARpPoDGAB2-jlQQH7FcKuA';
    getTableRecordsData(tableId, viewId).then(
      (res: { data: { records: IRecordsData[] } }) => {
        setTableRecordsData(res.data.records);
        console.log('res.data.records---->', res.data.records);
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

  const nextRecord = () => {
    if (recordIndex < recordsTotal - 1) {
      setRecordIndex(recordIndex + 1);
    }
  };

  const preRecord = () => {
    if (recordIndex > 0) {
      setRecordIndex(recordIndex - 1);
    }
  };

  const { t } = useTranslation();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen">
        <div className="fixed z-50 w-full bg-[#fff]">
          <ToolBar printRef={printRef} />
        </div>
        <div className="mx-[16px] flex h-full justify-start bg-gray-100 pt-[54px]">
          {settingModal && (
            <div className="border-r-1 flex w-[280px] min-w-[200px] flex-col  border-gray-700 bg-[#fff] px-2 py-[20px]">
              <div className="h-[300px]">
                <h2 className="mb-4">{t('base_elements')}</h2>
                <BaseElementsContent />
              </div>
              <div className="flex flex-col">
                <h2 className="mb-4">{t('table_elements')}</h2>
                <div className="mb-4 flex justify-center space-x-2">
                  <Button
                    className="w-[150px]"
                    disabled={!canPre}
                    onClick={() => preRecord()}
                  >
                    {t('previous')}
                  </Button>
                  <Button
                    className="w-[150px]"
                    disabled={!canNext}
                    onClick={() => nextRecord()}
                  >
                    {t('next')}
                  </Button>
                </div>
                <RecordElementContent />
              </div>
            </div>
          )}
          <div className="relative h-full grow px-[70px] pt-[54px]">
            <div className="absolute left-0 top-0 w-full">
              {settingModal && <EditToolBar />}
            </div>
            <div className="h-full grow">
              <Print printRef={printRef} />
            </div>
            <div className="absolute left-0 top-[52px] h-full">
              {settingModal && <EditLeftToolBar />}
            </div>
          </div>
          {settingModal && <StyleSetting />}
        </div>
      </div>
    </DndProvider>
  );
};
