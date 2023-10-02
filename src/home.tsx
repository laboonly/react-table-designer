import { Print } from './pages/print/print';
import { ToolBar } from './pages/tool_bar';

export const Home = () => {
  return (
    <div className="bg-gray-300">
      <div>
        <ToolBar />
        <Print />
      </div>
    </div>
  );
};
