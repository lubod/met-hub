import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Data from '../data/data';
import Trend from '../trend/trend';

type Wind = {
  speed: number,
  dir: number,
  gust: number,
  dailyGust: number,
  dirTrend: Array<number>,
  gustTrend: Array<number>,
  speedTrend: Array<number>
}

const WindRose = function ({
  speed,
  dir,
  gust,
  dailyGust,
  dirTrend,
  gustTrend,
  speedTrend,
}: Wind) {
  const canvasRef = React.useRef(null);

  function drawDirArrow(radius: number, ctx: any) {
    if (dir != null) {
      const cos = Math.cos(dir * (Math.PI / 180) - Math.PI / 2);
      const sin = Math.sin(dir * (Math.PI / 180) - Math.PI / 2);
      const x0 = radius + 70 * cos;
      const y0 = radius + 70 * sin;
      const x1 = radius + 40 * cos;
      const y1 = radius + 40 * sin;
      const x2 = radius + 55 * Math.cos((dir - 7) * (Math.PI / 180) - Math.PI / 2);
      const y2 = radius + 55 * Math.sin((dir - 7) * (Math.PI / 180) - Math.PI / 2);
      const x3 = radius + 55 * Math.cos((dir + 7) * (Math.PI / 180) - Math.PI / 2);
      const y3 = radius + 55 * Math.sin((dir + 7) * (Math.PI / 180) - Math.PI / 2);
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'white';
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x1, y1);
      ctx.moveTo(x3, y3);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  }

  function drawDirTrend(radius: number, ctx: any, canvas: any) {
    if (dirTrend != null) {
      const dirTrendMap = new Map();
      let dirTrendMaxCount = 1;
      dirTrend.forEach((val) => {
        const diri = Math.floor((Math.floor(val / 22.5) + 1) / 2) % 8;

        if (dirTrendMap.has(diri)) {
          const count = dirTrendMap.get(diri) + 1;
          dirTrendMap.set(diri, count);
          if (count > dirTrendMaxCount) {
            dirTrendMaxCount = count;
          }
        } else {
          dirTrendMap.set(diri, 1);
        }
      });

      // console.log(dirTrendMap);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#17A2B8';
      dirTrendMap.forEach((count, diri) => {
        const num = Math.floor(count / 4) + 1;
        for (let i = 0; i < num; i += 1) {
          ctx.beginPath();
          ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            radius - 34 - i,
            (diri * 45 - 22.5 - 90) * (Math.PI / 180),
            (diri * 45 + 22.5 - 90) * (Math.PI / 180),
            false,
          );
          ctx.stroke();
        }
      });
    }
  }

  function drawWindRose(radius: number, ctx: any, canvas: any) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      radius - 30,
      0 * (Math.PI / 180),
      360 * (Math.PI / 180),
      false,
    );
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < 360; i += 45) {
      const cos = Math.cos(i * (Math.PI / 180) - Math.PI / 2);
      const sin = Math.sin(i * (Math.PI / 180) - Math.PI / 2);
      const x0 = radius + 76 * cos;
      const y0 = radius + 76 * sin;
      const x1 = radius + 70 * cos;
      const y1 = radius + 70 * sin;
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'white';
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.stroke();

    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#17A2B8';
    ctx.textAlign = 'center';
    ctx.fillText('N', canvas.width / 2, 23);

    ctx.font = '13px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('NE', canvas.width - 36, 46);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('E', canvas.width - 16, canvas.height / 2 + 8);

    ctx.font = '13px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('SE', canvas.width - 37, canvas.height - 37);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('S', canvas.width / 2, canvas.height - 6);

    ctx.font = '13px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('SW', 34, canvas.height - 37);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('W', 14, canvas.height / 2 + 8);

    ctx.font = '13px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('NW', 36, 46);

    ctx.font = 'bold 13px Arial';
    ctx.fillStyle = '#17A2B8';
    ctx.textAlign = 'center';
    ctx.fillText('Wind Dir', canvas.width / 2, canvas.height / 2 + 3);
  }

  function draw(canvas: any) {
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWindRose(radius, ctx, canvas);
    // drawSpeed(wind.speed, ctx, canvas);
    drawDirTrend(radius, ctx, canvas);
    // drawSpeedTrend(wind.speedTrend, ctx, canvas);
    drawDirArrow(radius, ctx);
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    draw(canvas);
  });

  // console.info('render windrose', props);
  return (
    <Row>
      <Col xs={8}>
        <canvas width="200" height="200" id="myCanvas" ref={canvasRef}>
          <p>Your browser doesn&apos;t support canvas. Boo hoo!</p>
        </canvas>
      </Col>
      <Col xs={4} className="text-left">
        <Data name="Wind Speed" value={speed} unit="km/h" fix={0} />
        <Trend data={speedTrend} range={5} />
        <Data name="Wind Gust" value={gust} unit="km/h" fix={1} />
        <Trend data={gustTrend} range={5} />
        <Data name="Daily Gust" value={dailyGust} unit="km/h" fix={1} />
      </Col>
    </Row>
  );
};

export default WindRose;
