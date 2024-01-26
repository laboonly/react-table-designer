import { Home } from './home';
import { IWordTemplatesType, useWordTemplates } from '@/store';
import { WordTemplate } from './word_template';

const App = () => {
  const { wordTemplateModal } = useWordTemplates(
    (state: IWordTemplatesType) => state,
  );
  return <div>{wordTemplateModal ? <WordTemplate /> : <Home />}</div>;
};

export default App;
