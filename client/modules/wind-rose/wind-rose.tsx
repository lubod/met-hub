import React from 'react';
import Data from '../data/data';
import { Row, Col } from 'react-bootstrap';
import './style.scss';
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

  function draw(canvas: any, wind: any) {
    const ctx = canvas.getContext('2d');
    let speed = wind.speed;
    let dir = wind.dir;
    const radius = canvas.width / 2;
    let dirTrend = new Set(props.dirTrend);

    if (typeof speed === 'undefined') {
      speed = 0;
    }
    if (typeof dir === 'undefined') {
      dir = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1b1c';
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.arc(canvas.width / 2, canvas.height / 2, radius - 30, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.arc(canvas.width / 2, canvas.height / 2, radius - 2, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
    ctx.stroke();

    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#DC3545";
    ctx.textAlign = "center";
    ctx.fillText("N", canvas.width / 2, 23);

    ctx.font = "13px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("NE", canvas.width - 38, 46);

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("E", canvas.width - 15, canvas.height / 2 + 8);

    ctx.font = "13px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("SE", canvas.width - 36, canvas.height - 40);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#white";
    ctx.textAlign = "center";
    ctx.fillText("S", canvas.width / 2, canvas.height - 6);

    ctx.font = "13px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("SW", 35, canvas.height - 40);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#white";
    ctx.textAlign = "center";
    ctx.fillText("W", 15, canvas.height / 2 + 8);

    ctx.font = "13px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("NW", 39, 46);

    ctx.font = "13px Arial";
    ctx.fillStyle = "#17A2B8";
    ctx.textAlign = "center";
    ctx.fillText("Speed", canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(speed.toFixed(1), canvas.width / 2 - 15, canvas.height / 2);

    ctx.font = "13px Arial";
    ctx.fillStyle = "while";
    ctx.textAlign = "center";
    ctx.fillText("km/h", canvas.width / 2 + 28, canvas.height / 2);

    ctx.beginPath();
    for (var i = 0; i < 360; i += 22.5) {
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

    const cos = Math.cos((dir) * Math.PI / 180 - Math.PI / 2);
    const sin = Math.sin((dir) * Math.PI / 180 - Math.PI / 2);
    const x0 = radius + 70 * cos;
    const y0 = radius + 70 * sin;
    const x1 = radius + 50 * cos;
    const y1 = radius + 50 * sin;
    const x2 = radius + 60 * Math.cos((dir - 7) * Math.PI / 180 - Math.PI / 2);
    const y2 = radius + 60 * Math.sin((dir - 7) * Math.PI / 180 - Math.PI / 2);
    const x3 = radius + 60 * Math.cos((dir + 7) * Math.PI / 180 - Math.PI / 2);
    const y3 = radius + 60 * Math.sin((dir + 7) * Math.PI / 180 - Math.PI / 2);
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#17A2B8';
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x2, y2);
    ctx.lineTo(x1, y1);
    ctx.moveTo(x3, y3);
    ctx.lineTo(x1, y1);

    dirTrend.forEach(function (val1) {
      const cos = Math.cos((val1) * Math.PI / 180 - Math.PI / 2);
      const sin = Math.sin((val1) * Math.PI / 180 - Math.PI / 2);
      const x0 = radius + 70 * cos;
      const y0 = radius + 70 * sin;
      const x1 = radius + 65 * cos;
      const y1 = radius + 65 * sin;
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    });
    ctx.stroke();

    const height = 15;
    const width = 60;
    let max = Math.max(...props.speedTrend);
    let min = Math.min(...props.speedTrend);
    const range = 5;

    if (max - min < range) {
      min = min;
      max = max + range;
    }
    const k = (height - 1) / (max - min);
    const s = 1 - min * k;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#17A2B8';
    for (let i = 0; i < props.speedTrend.length; i++) {
      ctx.moveTo(i + canvas.width / 2 - width / 2, height + canvas.height / 2 + 10);
      const y = Math.round(height - (props.speedTrend[i] * k + s));
      ctx.lineTo(i + canvas.width / 2 - width / 2, y + canvas.height / 2 + 10);
    }
    ctx.stroke();
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    draw(canvas, props);
  });

  return (
    <Row>
      <Col xs={8}>
        <canvas width='200' height='200' id='myCanvas' ref={canvasRef} >
          <p>Your browser doesn't support canvas. Boo hoo!</p>
        </canvas>
      </Col>
      <Col xs={4} className='text-left'>
        <Data name='Wind Dir' value={props.dir} unit='°' fix={0}></Data>
        <Data name='Wind Gust' value={props.gust} unit='km/h' fix={1}></Data>
        <Trend data={props.gustTrend} range={5}></Trend>
        <Data name='Daily Gust' value={props.dailyGust} unit='km/h' fix={1}></Data>
      </Col>
    </Row>
  );
};

export default WindRose;
