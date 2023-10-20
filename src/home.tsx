import { Print } from './pages/print/print';
import { ToolBar } from './pages/tool_bar';
import { StyleSetting } from './pages/style_setting';
import { useSettingModalStore } from './store';
import { BaseElementsContent } from './pages/elements_content/base_element_content';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export const Home = () => {
  const settingModal = useSettingModalStore((state: any) => state.settingModal);

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <div className="fixed z-50 w-full bg-[#fff]">
          <ToolBar />
        </div>
        <div className="flex  justify-start bg-gray-100 pt-[54px]">
          {settingModal && (
            <div className="border-r-1 flex w-[280px] min-w-[200px] flex-col  border-gray-700 bg-[#fff] px-2 py-[20px]">
              <div className="h-[300px]">
                <h2 className="mb-4">Static elements</h2>
                <BaseElementsContent />
              </div>
              <div className="flex flex-col">
                <h2 className="mb-4">Fields from your table data</h2>
              </div>
            </div>
          )}
          <div className="grow">
            <Print />
          </div>
          {settingModal && <StyleSetting />}
        </div>
      </>
    </DndProvider>
  );
};
