import { Print } from './pages/print/print';
import { ToolBar } from './pages/tool_bar';
import { StyleSetting } from './pages/style_setting';
import { EditToolBar } from '@/pages/edit_tool_bar';
import { RecordElementContent } from './pages/record_element_content';
import { BaseElementsContent } from './pages/elements_content/base_element_content';
import {
  useSettingModalStore,
  usePrintAreaPosition,
  ISettingModalType,
  IPrintAreaPositionStoreType,
} from './store';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useWindowSize, useScroll } from 'react-use';
import { useEffect, useRef } from 'react';

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
          <div className="relative h-full grow pt-[54px]">
            <div className="absolute left-0 top-0 w-full">
              {settingModal && <EditToolBar />}
            </div>
            <div className="h-full grow">
              <Print printRef={printRef} />
            </div>
          </div>
          {settingModal && <StyleSetting />}
        </div>
      </div>
    </DndProvider>
  );
};
