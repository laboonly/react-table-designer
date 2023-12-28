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
} from './store';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useWindowSize, useScroll } from 'react-use';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
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

  const { recordIndex, setRecordIndex, recordsTotal } = useTableRecordData(
    (state: ITableRecordDataStoreType) => state,
  );
  const canNext = recordIndex < recordsTotal - 1;
  const canPre = recordIndex > 0;

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
                <h2 className="mb-4">Static elements</h2>
                <BaseElementsContent />
              </div>
              <div className="flex flex-col">
                <h2 className="mb-4">Fields from your table data</h2>
                <div className="flex justify-center space-x-2">
                  <Button
                    className="w-[150px]"
                    disabled={!canPre}
                    onClick={() => preRecord()}
                  >
                    Previous
                  </Button>
                  <Button
                    className="w-[150px]"
                    disabled={!canNext}
                    onClick={() => nextRecord()}
                  >
                    Next
                  </Button>
                </div>
                <RecordElementContent />
              </div>
            </div>
          )}
          <div className="relative h-full grow pt-[54px]">
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
