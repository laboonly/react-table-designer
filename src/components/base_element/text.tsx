import { Rnd } from 'react-rnd';

const baseStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: '#f0f0f0',
} as const;

interface ITextProps {
  text: string;
  style?: any;
}

export const Text: React.FC<React.PropsWithChildren<ITextProps>> = (props) => {
  const { text, style } = props;
  return (
    <Rnd
      style={{ ...baseStyle, ...style }}
      default={{
        x: 0,
        y: 0,
        width: 200,
        height: 34,
      }}
    >
      {text}
    </Rnd>
  );
};
