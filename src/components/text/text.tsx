import { Rnd } from 'react-rnd';

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: '#f0f0f0',
} as const;

interface ITextProps {
  text: string;
}

export const Text: React.FC<React.PropsWithChildren<ITextProps>> = (props) => {
  const { text } = props;
  return (
    <Rnd
      style={style}
      default={{
        x: 0,
        y: 0,
        width: 200,
        height: 200,
      }}
    >
      {text}
    </Rnd>
  );
};
