import { Text } from '../../components/base_element/text';

export const BaseElementsContent = () => {
  return (
    <div className="flex flex-col">
      <Text
        text="hello"
        style={{
          top: 10,
        }}
      />
      <Text
        text="yyy"
        style={{
          top: 50,
        }}
      />
    </div>
  );
};
