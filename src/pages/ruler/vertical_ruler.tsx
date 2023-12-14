import { useEffect, useRef } from 'react';
import { extractNumberFromLengthString } from '@/lib/utils';

interface IRulerCanvasProps {
  width: string;
}

export const VerticalRulerCanvas: React.FC<IRulerCanvasProps> = (props) => {
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
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, widthInPixels);
    ctx.stroke();

    // 绘制刻度和标注
    const mmInterval = 1; // 每一毫米一个标注
    const pixelsPerInterval = mmInterval * mmToPixel;
    const numberOfTicks = widthInMm / mmInterval;

    for (let i = 0; i <= numberOfTicks; i++) {
      const x = i * pixelsPerInterval;
      let width = canvas.width / 3; // 每一毫米一个三分之一高度的标注

      // 每五毫米一半高度的标注
      if (i % 5 === 0 && i % 10 !== 0 && i !== 0 && i !== numberOfTicks) {
        width = canvas.width / 1.5;
      }

      // 每十毫米完整高度的标注
      if (i % 10 === 0 && i !== numberOfTicks) {
        width = canvas.width;
      }

      ctx.beginPath();
      ctx.moveTo(canvas.width, x);
      ctx.lineTo(canvas.width - width, x);

      ctx.stroke();

      // 绘制标注
      const label = i * mmInterval;
      if (label % 10 === 0 || i === 0) {
        // 旋转绘图方向，使文字朝上方
        ctx.save();
        ctx.translate(canvas.width / 2, x - 1);
        ctx.rotate(-Math.PI / 2);

        ctx.fillText(label.toString(), 0, 0);
        ctx.restore();
      }
    }
  }, [width]); // 仅在组件挂载时执行一次

  return <canvas ref={canvasRef} width={15} height={widthInPixels} />;
};
