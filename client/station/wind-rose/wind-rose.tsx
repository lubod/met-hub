/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { observer } from "mobx-react";
import React from "react";
import { Row, Col } from "react-bootstrap";
import { AppContext } from "../..";
import MY_COLORS from "../../../common/colors";
import { STATION_MEASUREMENTS_DESC } from "../../../common/stationModel";
import DataAlone from "../../misc/dataAlone";
import DataWithTrend from "../../misc/dataWithTrend";

type Wind = {
  speed: number;
  dir: number;
  gust: number;
  dailyGust: number;
  dirTrend: Array<number>;
  gustTrend: Array<number>;
  speedTrend: Array<number>;
  appContext: AppContext;
  color: string;
};

const WindRose = observer(
  ({
    speed,
    dir,
    gust,
    dailyGust,
    dirTrend,
    gustTrend,
    speedTrend,
    appContext,
    color,
  }: Wind) => {
    function polarToCartesian(
      centerX: number,
      centerY: number,
      radius: number,
      angleInDegrees: number
    ) {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    }

    function describeArc(
      x: number,
      y: number,
      radius: number,
      startAngle: number,
      endAngle: number
    ) {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);

      const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
      const d = [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        arcSweep,
        0,
        end.x,
        end.y,
      ].join(" ");

      return d;
    }
    // console.info('render windrose', props);
    const width = 220;
    const height = width;
    const offset = 30;
    const radius = width / 2 - offset;
    const dirTrendMap = new Map();
    let dirTrendMaxCount = 1;

    dirTrend?.forEach((val) => {
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

    return (
      <Row>
        <Col xs={8}>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              appContext.setMeasurementAndLoad(
                STATION_MEASUREMENTS_DESC.WINDDIR
              )
            }
          >
            <svg width="220px" height="220px">
              <circle
                cx={width / 2}
                cy={height / 2}
                r={radius}
                stroke="white"
                fill="none"
              />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((value) => (
                <line
                  x1={width / 2}
                  y1={offset + 4}
                  x2={width / 2}
                  y2={offset + 10}
                  stroke="white"
                  transform={`rotate(${value} ${width / 2} ${width / 2})`}
                />
              ))}
              {dir != null && (
                <polygon
                  points={`${width / 2 - 5} ${offset + 14}, ${width / 2} ${
                    offset + 50
                  }, ${width / 2 + 5} ${offset + 14}`}
                  fill={color}
                  stroke={color}
                  transform={`rotate(${dir} ${width / 2} ${height / 2})`}
                />
              )}
              <text
                x={width / 2}
                y="23"
                fontSize="20"
                textAnchor="middle"
                fill={color}
              >
                N
              </text>
              <text
                x={width / 2}
                y={width - 10}
                fontSize="20"
                textAnchor="middle"
                fill="white"
              >
                S
              </text>
              <text
                x={20 - 5}
                y={width / 2 + 7}
                fontSize="20"
                textAnchor="middle"
                fill="white"
              >
                W
              </text>
              <text
                x={width - 20}
                y={width / 2 + 7}
                fontSize="20"
                textAnchor="middle"
                fill="white"
              >
                E
              </text>
              <text
                x={width / 2}
                y={width / 2 + 4}
                fontSize="14"
                textAnchor="middle"
                fill={MY_COLORS.gray}
              >
                {STATION_MEASUREMENTS_DESC.WINDDIR.label}
              </text>
              {[...dirTrendMap.keys()].map((diri) =>
                [
                  ...Array(Math.floor(dirTrendMap.get(diri) / 4 + 1)).keys(),
                ].map((count) => (
                  <path
                    d={describeArc(
                      width / 2,
                      width / 2,
                      radius - 3 - count,
                      diri * 45 - 22.5,
                      diri * 45 + 22.5
                    )}
                    stroke={color}
                    strokeWidth={2}
                    fill="none"
                  />
                ))
              )}
            </svg>
          </div>
        </Col>
        <Col xs={4} className="text-left">
          <DataWithTrend
            label={STATION_MEASUREMENTS_DESC.WINDSPEED.label}
            value={speed}
            unit={STATION_MEASUREMENTS_DESC.WINDSPEED.unit}
            fix={STATION_MEASUREMENTS_DESC.WINDSPEED.fix}
            data={speedTrend}
            range={STATION_MEASUREMENTS_DESC.WINDSPEED.range}
            couldBeNegative={
              STATION_MEASUREMENTS_DESC.WINDSPEED.couldBeNegative
            }
            onClick={() =>
              appContext.setMeasurementAndLoad(
                STATION_MEASUREMENTS_DESC.WINDSPEED
              )
            }
            color={color}
          />
          <DataWithTrend
            label={STATION_MEASUREMENTS_DESC.WINDGUST.label}
            value={gust}
            unit={STATION_MEASUREMENTS_DESC.WINDGUST.unit}
            fix={STATION_MEASUREMENTS_DESC.WINDGUST.fix}
            data={gustTrend}
            range={STATION_MEASUREMENTS_DESC.WINDGUST.range}
            couldBeNegative={STATION_MEASUREMENTS_DESC.WINDGUST.couldBeNegative}
            onClick={() =>
              appContext.setMeasurementAndLoad(
                STATION_MEASUREMENTS_DESC.WINDGUST
              )
            }
            color={color}
          />
          <DataAlone
            label={STATION_MEASUREMENTS_DESC.DAILYGUST.label}
            value={dailyGust}
            unit={STATION_MEASUREMENTS_DESC.DAILYGUST.unit}
            fix={STATION_MEASUREMENTS_DESC.DAILYGUST.fix}
          />
        </Col>
      </Row>
    );
  }
);

export default WindRose;
