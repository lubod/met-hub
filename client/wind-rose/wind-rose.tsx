import React from 'react';
import Data from '../data/data';
import { Row, Col } from 'react-bootstrap';
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

function WindRose(props: Wind) {
  const canvasRef = React.useRef(null);

  function drawDirArrow(dir: number, radius: number, ctx: any) {
    if (dir != null) {
      const cos = Math.cos((dir) * Math.PI / 180 - Math.PI / 2);
      const sin = Math.sin((dir) * Math.PI / 180 - Math.PI / 2);
      const x0 = radius + 70 * cos;
      const y0 = radius + 70 * sin;
      const x1 = radius + 40 * cos;
      const y1 = radius + 40 * sin;
      const x2 = radius + 55 * Math.cos((dir - 7) * Math.PI / 180 - Math.PI / 2);
      const y2 = radius + 55 * Math.sin((dir - 7) * Math.PI / 180 - Math.PI / 2);
      const x3 = radius + 55 * Math.cos((dir + 7) * Math.PI / 180 - Math.PI / 2);
      const y3 = radius + 55 * Math.sin((dir + 7) * Math.PI / 180 - Math.PI / 2);
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

  function drawSpeedTrend(windSpeedTrend: Array<number>, ctx: any, canvas: any) {
    if (windSpeedTrend != null) {
      const height = 15;
      const width = 60;
      let max = Math.max(...windSpeedTrend);
      let min = Math.min(...windSpeedTrend);
      const range = 5;

      if (max - min < range) {
        min = min;
        max = max + range;
      }
      const k = (height - 1) / (max - min);
      const s = 1 - min * k;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#17A2B8';
      for (let i = 0; i < windSpeedTrend.length; i++) {
        ctx.moveTo(i + canvas.width / 2 - width / 2, height + canvas.height / 2 + 10);
        const y = Math.round(height - (windSpeedTrend[i] * k + s));
        ctx.lineTo(i + canvas.width / 2 - width / 2, y + canvas.height / 2 + 10);
      }
      ctx.stroke();
    }
  }

  function drawDirTrend(windDirTrend: Array<number>, radius: number, ctx: any, canvas: any) {
    if (windDirTrend != null) {
      const dirTrendMap = new Map();
      let dirTrendMaxCount = 1;
      windDirTrend.forEach(val => {
        let diri = Math.floor((Math.floor(val / 22.5) + 1) / 2) % 8;

        if (dirTrendMap.has(diri)) {
          const count = dirTrendMap.get(diri) + 1;
          dirTrendMap.set(diri, count);
          if (count > dirTrendMaxCount) {
            dirTrendMaxCount = count;
          }
        }
        else {
          dirTrendMap.set(diri, 1);
        }
      });

      //console.log(dirTrendMap);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#17A2B8';
      dirTrendMap.forEach(function (count, diri, map) {
        const num = Math.floor(count / 4) + 1;
        for (let i = 0; i < num; i++) {
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, radius - 34 - i, (diri * 45 - 22.5 - 90) * (Math.PI / 180), (diri * 45 + 22.5 - 90) * (Math.PI / 180), false);
          ctx.stroke();
        }
      });
    }
  }

  function drawSpeed(speed: number, ctx: any, canvas: any) {
    if (speed != null) {
      ctx.font = "25px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(speed, canvas.width / 2 - 15, canvas.height / 2);

      ctx.font = "13px Arial";
      ctx.fillStyle = "while";
      ctx.textAlign = "center";
      ctx.fillText("km/h", canvas.width / 2 + 28, canvas.height / 2);
    }
  }

  function drawWindRose(radius: number, ctx: any, canvas: any) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.arc(canvas.width / 2, canvas.height / 2, radius - 30, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
    ctx.stroke();

    ctx.beginPath();
    for (var i = 0; i < 360; i += 45) {
      const cos = Math.cos((i) * Math.PI / 180 - Math.PI / 2);
      const sin = Math.sin((i) * Math.PI / 180 - Math.PI / 2);
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

    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#17A2B8";
    ctx.textAlign = "center";
    ctx.fillText("N", canvas.width / 2, 23);

    ctx.font = "13px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("NE", canvas.width - 36, 46);

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("E", canvas.width - 16, canvas.height / 2 + 8);

    ctx.font = "13px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("SE", canvas.width - 37, canvas.height - 37);

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("S", canvas.width / 2, canvas.height - 6);

    ctx.font = "13px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("SW", 34, canvas.height - 37);

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("W", 14, canvas.height / 2 + 8);

    ctx.font = "13px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("NW", 36, 46);

    ctx.font = "bold 13px Arial";
    ctx.fillStyle = "#17A2B8";
    ctx.textAlign = "center";
    ctx.fillText("Wind Dir", canvas.width / 2, canvas.height / 2 + 3);
  }

  function draw(wind: Wind, canvas: any) {
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWindRose(radius, ctx, canvas);
    //drawSpeed(wind.speed, ctx, canvas);
    drawDirTrend(wind.dirTrend, radius, ctx, canvas);
    //drawSpeedTrend(wind.speedTrend, ctx, canvas);
    drawDirArrow(wind.dir, radius, ctx);
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    draw(props, canvas);
  });

  //console.info('render windrose', props);
  return (
    <Row>
      <Col xs={8}>
        <canvas width='200' height='200' id='myCanvas' ref={canvasRef} >
          <p>Your browser doesn't support canvas. Boo hoo!</p>
        </canvas>
      </Col>
      <Col xs={4} className='text-left'>
        <Data name='Wind Speed' value={props.speed} unit='km/h' fix={0}></Data>
        <Trend data={props.speedTrend} range={5}></Trend>
        <Data name='Wind Gust' value={props.gust} unit='km/h' fix={1}></Data>
        <Trend data={props.gustTrend} range={5}></Trend>
        <Data name='Daily Gust' value={props.dailyGust} unit='km/h' fix={1}></Data>
      </Col>
    </Row>
  );
};

export default WindRose;
