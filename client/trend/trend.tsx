import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type TrendData = {
  range: number,
  data: Array<number>
}

const Trend = function ({
  range,
  data,
}: TrendData) {
  const canvasRef = React.useRef(null);
  let max = data != null ? Math.max(...data) : null;
  const min = data != null ? Math.min(...data) : null;

  function draw(canvas: any) {
    //    console.log(trend.data);
    if (data != null) {
      const ctx = canvas.getContext('2d');
      if (max - min < range) {
        max = min + range;
      }
      const k = (canvas.height - 1) / (max - min);
      const s = 1 - min * k;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#17A2B8';
      for (let i = 0; i < data.length; i += 1) {
        ctx.moveTo(i, canvas.height);
        const y = Math.round(canvas.height - (data[i] * k + s));
        ctx.lineTo(i, y);
      }
      ctx.stroke();
    }
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    draw(canvas);
  });

  // console.info('render trend');
  return (
    <OverlayTrigger overlay={(
      <Tooltip id="tooltip">
        (
        {min?.toFixed(1)}
        ,
        {max?.toFixed(1)}
        )
      </Tooltip>
    )}
    >
      <div className="text-left">
        <canvas width="60" height="15" id="myCanvas" ref={canvasRef}>
          <p>Your browser doesn&apos;t support canvas. Boo hoo!</p>
        </canvas>
      </div>
    </OverlayTrigger>
  );
};

export default Trend;
