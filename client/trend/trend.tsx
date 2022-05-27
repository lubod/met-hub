/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { observer } from "mobx-react";
import React from "react";
import { Area, AreaChart, YAxis } from "recharts";
import { AuthData } from "../auth";
import MyModal from "./mymodal";

type TrendData = {
  name: string;
  data: Array<number>;
  range: number;
  unit: string;
  couldBeNegative: boolean;
  measurement: string;
  authData: AuthData;
};

const Trend = observer(
  ({
    name,
    data,
    range,
    unit,
    couldBeNegative,
    measurement,
    authData,
  }: TrendData) => {
    const [modalShow, setModalShow] = React.useState(false);

    let max: number = null;
    let min: number = null;
    let avg: number = null;
    let sum: number = null;

    function round(value: number, precision: number) {
      const multiplier = 10 ** (precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

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
    let domainMin = round(avg - range / 2, 1);
    let domainMax = round(avg + range / 2, 1);
    if (max - min > range) {
      domainMin = min;
      domainMax = max;
    }

    if (domainMin < 0 && couldBeNegative === false) {
      domainMin = 0;
    }

    const handleClose = () => {
      setModalShow(false);
    };

    const handleShow = () => {
      if (authData.isAuth) {
        setModalShow(true);
      }
    };

    const chdata = [];
    for (let i = 0; i < data.length; i += 1) {
      chdata.push({ minute: i, value: data[i] });
    }

    // console.info("render trend");
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
            bottom: 9,
          }}
        >
          <Area
            type="monotone"
            dataKey="value"
            stroke="#17A2B8"
            fill="#17A2B8"
          />
          <YAxis hide type="number" domain={[domainMin, domainMax]} />
        </AreaChart>
        <div onClick={(e) => e.stopPropagation()}>
          <MyModal
            modalShow={modalShow}
            handleClose={handleClose}
            name={name}
            unit={unit}
            measurement={measurement}
            couldBeNegative={couldBeNegative}
            authData={authData}
          />
        </div>
      </div>
    );
  }
);

export default Trend;
