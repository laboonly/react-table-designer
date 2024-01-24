import { ToolBar } from '../pages/tool_bar';
import { TemplateLeft } from './template_left';
import { WordTemplatePreview } from './word_template_preview';

export const WordTemplate = () => {
  return (
    <div className="h-screen">
      <div className="fixed z-50 w-full bg-[#fff]">
        <ToolBar />
      </div>
      <div className="mx-[16px] flex h-full justify-start bg-gray-100 pt-[54px]">
        <TemplateLeft />
        <WordTemplatePreview />
      </div>
    </div>
  );
};
