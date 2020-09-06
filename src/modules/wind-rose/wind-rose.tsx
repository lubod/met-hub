import React from 'react';
import './style.scss';

type Wind = {
  speed: string,
  dir: string,
  gust: string,
  dailyGust: string
}

function WindRose(props: Wind) {
  const canvasRef = React.useRef(null);

  function draw(canvas: any, wind: any) {
    const ctx = canvas.getContext('2d');
    let speed = parseFloat(wind.speed);
    let dir = parseFloat(wind.dir);
    let gust = parseFloat(wind.gust);
    let dailyGust = parseFloat(wind.dailyGust);

    if (typeof speed === 'undefined') {
      speed = 0;
    }
    if (typeof dir === 'undefined') {
      dir = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#343A40';
    ctx.arc(100, 100, 100, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.arc(100, 100, 70, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.arc(100, 100, 98, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
    ctx.stroke();

    ctx.font = "bold 25px Courier New";
    ctx.fillStyle = "#DC3545";
    ctx.textAlign = "center";
    ctx.fillText("N", 200 / 2, 23);

    ctx.font = "16px Courier New";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("NE", 162, 46);

    ctx.font = "25px Courier New";
    ctx.fillStyle = "#white";
    ctx.textAlign = "center";
    ctx.fillText("E", 200 - 15, 200 / 2 + 8);

    ctx.font = "16px Courier New";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("SE", 164, 160);

    ctx.font = "25px Courier New";
    ctx.fillStyle = "#white";
    ctx.textAlign = "center";
    ctx.fillText("S", 200 / 2, 200 - 6);

    ctx.font = "16px Courier New";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("SW", 35, 160);

    ctx.font = "25px Courier New";
    ctx.fillStyle = "#white";
    ctx.textAlign = "center";
    ctx.fillText("W", 15, 200 / 2 + 8);

    ctx.font = "16px Courier New";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("NW", 39, 46);

    ctx.font = "30px Arial";
    ctx.fillStyle = "#17A2B8";
    ctx.textAlign = "center";
    ctx.fillText(speed.toFixed(1), 200 / 2, 200 / 2);

    ctx.font = "12px Arial";
    ctx.fillStyle = "17A2B8";
    ctx.textAlign = "center";
    ctx.fillText("km/h", 200 / 2, 200 / 2 + 16);

    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Speed", 200 / 2, 200 / 2 - 28);

    const cos = Math.cos((dir) * Math.PI / 180 - Math.PI / 2);
    const sin = Math.sin((dir) * Math.PI / 180 - Math.PI / 2);
    const x0 = 100 + 70 * cos;
    const y0 = 100 + 70 * sin;
    const x1 = 100 + 50 * cos;
    const y1 = 100 + 50 * sin;
    const x2 = 100 + 60 * Math.cos((dir - 7) * Math.PI / 180 - Math.PI / 2);
    const y2 = 100 + 60 * Math.sin((dir - 7) * Math.PI / 180 - Math.PI / 2);
    const x3 = 100 + 60 * Math.cos((dir + 7) * Math.PI / 180 - Math.PI / 2);
    const y3 = 100 + 60 * Math.sin((dir + 7) * Math.PI / 180 - Math.PI / 2);
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#17A2B8';
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x2, y2);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x3, y3);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    for (var i = 0; i < 360; i += 22.5) {
      const cos = Math.cos((i) * Math.PI / 180 - Math.PI / 2);
      const sin = Math.sin((i) * Math.PI / 180 - Math.PI / 2);
      const x0 = 100 + 76 * cos;
      const y0 = 100 + 76 * sin;

      const x1 = 100 + 70 * cos;
      const y1 = 100 + 70 * sin;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'white';
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    draw(canvas, props);
  });

  return (
    <div className='row'>
      <div className='col-2 text-right'>
        <div className='small'>Wind Gust</div>
        <div className='h4 text-info'>{props.gust}</div>
        <div className='text-info small'>km/h</div>
      </div>
      <div className='col-8'>
        <canvas width='200' height='200' id='myCanvas' ref={canvasRef} >
          <p>Your browser doesn't support canvas. Boo hoo!</p>
        </canvas>
      </div>
      <div className='col-2 text-left'>
        <div className='small'>Daily Gust</div>
        <div className='h4 text-info'>{props.dailyGust}</div>
        <div className='text-info small'>km/h</div>
      </div>
    </div>
  );
};

export default WindRose;