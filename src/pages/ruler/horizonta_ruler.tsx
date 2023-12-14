import { useEffect, useRef } from 'react';
import { extractNumberFromLengthString } from '@/lib/utils';

interface IRulerCanvasProps {
  width: string;
}

export const HorizontaRulerCanvas: React.FC<IRulerCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width } = props;
  const mmToPixel = 3.77953; // 1毫米等于3.77953像素
  const widthInMm = extractNumberFromLengthString(width); // 300毫米
  const widthInPixels = widthInMm * mmToPixel;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#d4d4d8';
    // 绘制底部水平线
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 1);
    ctx.lineTo(widthInPixels, canvas.height - 1);
    ctx.stroke();

    // 绘制刻度和标注
    const mmInterval = 1; // 每一毫米一个标注
    const pixelsPerInterval = mmInterval * mmToPixel;
    const numberOfTicks = widthInMm / mmInterval;

    for (let i = 0; i <= numberOfTicks; i++) {
      const x = i * pixelsPerInterval;
      let height = canvas.height / 3; // 每一毫米一个三分之一高度的标注

      // 每五毫米一半高度的标注
      if (i % 5 === 0 && i % 10 !== 0 && i !== 0 && i !== numberOfTicks) {
        height = canvas.height / 1.5;
      }

      // 每十毫米完整高度的标注
      if (i % 10 === 0 && i !== numberOfTicks) {
        height = canvas.height;
      }

      ctx.beginPath();
      ctx.moveTo(x, canvas.height - 1);
      ctx.lineTo(x, canvas.height - height);
      ctx.stroke();

      // 绘制标注
      const label = i * mmInterval;
      if (label % 10 === 0 || i === 0) {
        ctx.fillText(label.toString(), x + 1, canvas.height / 2);
      }
    }
  }, [width]); // 仅在组件挂载时执行一次

  return <canvas ref={canvasRef} width={widthInPixels} height={15} />;
};
