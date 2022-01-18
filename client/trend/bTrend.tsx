/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";

type TrendData = {
  range: number;
  data: Array<number>;
};

const BTrend = function ({ range, data }: TrendData) {
  const canvasRef = React.useRef(null);
  let max = data != null ? Math.max(...data) : null;
  const min = data != null ? Math.min(...data) : null;

  function draw(canvas: any) {
    console.info(data, min, max, canvas);
    if (data != null) {
      const ctx = canvas.getContext("2d");
      if (max - min < range) {
        max = min + range;
      }
      const k = (canvas.height - 1) / (max - min);
      const s = 1 - min * k;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = canvas.width / 61; // lineWidth centered
      console.info(ctx.lineWidth);
      ctx.strokeStyle = "#17A2B8";
      for (let i = 0; i < data.length; i += 1) {
        ctx.moveTo(i * ctx.lineWidth + ctx.lineWidth / 2, canvas.height);
        const y = Math.round(canvas.height - (data[i] * k + s));
        ctx.lineTo(i * ctx.lineWidth + ctx.lineWidth / 2, y);
      }
      ctx.stroke();
    }
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    // Make it visually fill the positioned parent
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    // ...then set the internal size to match
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw(canvas);
  });

  // console.info('render trend');
  return (
    <div className="text-left">
      <canvas id="myCanvas" ref={canvasRef}>
        <p>Your browser doesn&apos;t support canvas. Boo hoo!</p>
      </canvas>
    </div>
  );
};

export default BTrend;
