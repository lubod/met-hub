import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './style.scss';

type TrendData = {
  range: number,
  data: Array<number>
}

function Trend(props: TrendData) {
  const canvasRef = React.useRef(null);
  let max = Math.max(...props.data);
  let min = Math.min(...props.data);

  function draw(canvas: any, trend: any) {
//    console.log(trend.data);
    const ctx = canvas.getContext('2d');
    if (max - min < trend.range) {
      min = min;
      max = min + trend.range;
    }
    const k = (canvas.height - 1) / (max - min);
    const s = 1 - min * k;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#17A2B8';
    for (let i = 0; i < trend.data.length; i++) {
      ctx.moveTo(i, canvas.height);
      const y = Math.round(canvas.height - (trend.data[i] * k + s));
      ctx.lineTo(i, y);
    }
    ctx.stroke();
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    draw(canvas, props);
  });

  return (
    <OverlayTrigger overlay={<Tooltip id="tooltip">({min.toFixed(1)}, {max.toFixed(1)})</Tooltip>}>
      <div className='text-left'>
        <canvas width='60' height='15' id='myCanvas' ref={canvasRef} >
          <p>Your browser doesn't support canvas. Boo hoo!</p>
        </canvas>
      </div>
    </OverlayTrigger>
  );
};

export default Trend;