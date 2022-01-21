/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { Modal } from "react-bootstrap";
import { Area, AreaChart } from "recharts";
import BTrend from "./bTrend";

type TrendData = {
  name: string;
  data: Array<number>;
};

const Trend = function ({ name, data }: TrendData) {
  let max: number = null;
  let min: number = null;
  let avg: number = null;
  let sum: number = null;

  for (let i = 0; i < data.length; i += 1) {
    if (i === 0) {
      // eslint-disable-next-line no-multi-assign
      max = min = sum = data[i];
    } else {
      if (data[i] > max) {
        max = data[i];
      }
      if (data[i] < min) {
        min = data[i];
      }
      sum += data[i];
    }
  }
  avg = sum / data.length;

  const [modalShow, setModalShow] = React.useState(false);

  const handleClose = () => {
    setModalShow(false);
  };
  const handleShow = () => {
    setModalShow(true);
  };

  const chdata = [];
  for (let i = 0; i < data.length; i += 1) {
    chdata.push({ minute: i, value: data[i] });
  }
  // console.info('render trend');
  return (
    <div
      className="text-center"
      style={{ display: "flex", justifyContent: "center" }}
      onClick={handleShow}
    >
      <AreaChart
        width={60}
        height={25}
        data={chdata}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 10,
        }}
      >
        <Area type="monotone" dataKey="value" stroke="#17A2B8" fill="#17A2B8" />
      </AreaChart>
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
            <Modal.Title id="contained-modal-title-vcenter">
              {name}, min={min}, max={max}, avg={avg.toFixed(1)}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BTrend chdata={chdata} max={max} />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Trend;
