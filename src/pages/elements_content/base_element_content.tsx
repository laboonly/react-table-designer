import { TextElement, ImageElement } from '../../components/base_element';

export const BaseElementsContent = () => {
  return (
    <div className="flex flex-col space-y-4">
      <TextElement />
      <ImageElement />
    </div>
  );
};
