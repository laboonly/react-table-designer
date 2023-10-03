import { Print } from './pages/print/print';
import { ToolBar } from './pages/tool_bar';
import { BaseElementsContent } from './pages/elements_content';
import { useElementStore } from './store';

export const Home = () => {
  const elementShow = useElementStore((state) => state.elementShow);
  return (
    <div className="flex justify-start bg-gray-100">
      {elementShow && (
        <div className="border-r-1 flex w-[280px] flex-col border-gray-700  bg-[#fff] px-2 py-10">
          <div className="clear-both h-[300px]">
            <h2>Static Elements</h2>
            <BaseElementsContent />
          </div>
          <div className="flex flex-col">
            <h2>Fields From your Table Data</h2>
          </div>
        </div>
      )}
      <div className="grow">
        <ToolBar />
        <Print />
      </div>
    </div>
  );
};
