/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { observer } from "mobx-react";
import React from "react";
import { AppContext } from "..";
import MY_COLORS from "../../common/colors";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";
import NumberDataAlone from "../misc/numberDataAlone";
import NumberDataWithTrend from "../misc/numberDataWithTrend";

type Props = {
  appContext: AppContext;
};

const WindRose = observer(({ appContext }: Props) => {
  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
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
    endAngle: number,
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
  const gustTrend = appContext.cCtrl.stationData.trendData.windgust;
  const speedTrend = appContext.cCtrl.stationData.trendData.windspeed;
  const dirTrend = appContext.cCtrl.stationData.trendData.winddir;
  const speed = appContext.cCtrl.stationData.data.windspeed;
  const dir = appContext.cCtrl.stationData.data.winddir;
  const gust = appContext.cCtrl.stationData.data.windgust;
  const dailyGust = appContext.cCtrl.stationData.data.maxdailygust;
  const { color } = STATION_MEASUREMENTS_DESC.WINDDIR;
  const old = appContext.cCtrl.stationData.oldData;

  const width = 200;
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
    <div className="flex flex-row">
      <div className="flex flex-col py-4 basis-2/3 place-items-center">
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.WINDDIR)
          }
        >
          <svg width="200px" height="200px">
            <circle
              cx={width / 2}
              cy={height / 2}
              r={radius}
              stroke="white"
              fill="none"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((value) => (
              <line
                key={value}
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
              [...Array(Math.floor(dirTrendMap.get(diri) / 4 + 1)).keys()].map(
                (count) => (
                  <path
                    d={describeArc(
                      width / 2,
                      width / 2,
                      radius - 3 - count,
                      diri * 45 - 22.5,
                      diri * 45 + 22.5,
                    )}
                    stroke={color}
                    strokeWidth={2}
                    fill="none"
                  />
                ),
              ),
            )}
          </svg>
        </div>
      </div>
      <div className="flex flex-col gap-4 basis-1/3">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.WINDSPEED}
          value={speed}
          trend={speedTrend}
          onClick={() =>
            appContext.setMeasurementAndLoad(
              STATION_MEASUREMENTS_DESC.WINDSPEED,
            )
          }
          old={old}
        />
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.WINDGUST}
          value={gust}
          trend={gustTrend}
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.WINDGUST)
          }
          old={old}
        />
        <NumberDataAlone
          label={STATION_MEASUREMENTS_DESC.MAXDAILYGUST.label}
          value={dailyGust}
          unit={STATION_MEASUREMENTS_DESC.MAXDAILYGUST.unit}
          fix={STATION_MEASUREMENTS_DESC.MAXDAILYGUST.fix}
          old={old}
        />
      </div>
    </div>
  );
});

export default WindRose;
