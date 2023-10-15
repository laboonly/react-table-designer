interface ITextPrintElemntProps {
  text: string;
  styles?: any;
}

export const TextPrintElement: React.FC<
  React.PropsWithChildren<ITextPrintElemntProps>
> = (props) => {
  const { text, styles } = props;
  return <div style={{ ...styles }}>{text}</div>;
};
