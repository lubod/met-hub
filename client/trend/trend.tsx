/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { Modal } from "react-bootstrap";
import BTrend from "./bTrend";

type TrendData = {
  name: string;
  range: number;
  data: Array<number>;
};

const Trend = function ({ name, range, data }: TrendData) {
  const canvasRef = React.useRef(null);
  let max = data != null ? Math.max(...data) : null;
  const min = data != null ? Math.min(...data) : null;
  const [modalShow, setModalShow] = React.useState(false);

  const handleClose = () => {
    setModalShow(false);
  };
  const handleShow = () => {
    setModalShow(true);
  };

  function draw(canvas: any) {
    //    console.log(trend.data);
    if (data != null) {
      const ctx = canvas.getContext("2d");
      if (max - min < range) {
        max = min + range;
      }
      const k = (canvas.height - 1) / (max - min);
      const s = 1 - min * k;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#17A2B8";
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
    <div className="text-left" onClick={handleShow}>
      <canvas width="60" height="15" id="myCanvas" ref={canvasRef}>
        <p>Your browser doesn&apos;t support canvas. Boo hoo!</p>
      </canvas>
      <div onClick={(e) => e.stopPropagation()}>
        <Modal
          show={modalShow}
          onHide={handleClose}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">{name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BTrend range={range} data={data} />
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      </div>
    </div>
  );
};

export default Trend;
