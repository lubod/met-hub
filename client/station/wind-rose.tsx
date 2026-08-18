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

function getCardinal(deg: number | null): string {
  if (deg == null) return "–";
  const cardinals = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  const val = Math.floor((deg / 22.5) + 0.5);
  return cardinals[val % 16];
}

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

  const gustTrend = appContext.cCtrl.stationData.trendData.windgust;
  const speedTrend = appContext.cCtrl.stationData.trendData.windspeed;
  const dirTrend = appContext.cCtrl.stationData.trendData.winddir;
  const speed = appContext.cCtrl.stationData.data.windspeed;
  const dir = appContext.cCtrl.stationData.data.winddir;
  const gust = appContext.cCtrl.stationData.data.windgust;
  const dailyGust = appContext.cCtrl.stationData.data.maxdailygust;
  const { color } = STATION_MEASUREMENTS_DESC.WINDDIR;
  const old = appContext.cCtrl.stationData.oldData;

  const width = 210;
  const height = width;
  const center = width / 2;
  const offset = 26;
  const radius = width / 2 - offset;
  const dirTrendMap = new Map<number, number>();
  let dirTrendMaxCount = 1;

  dirTrend?.forEach((val) => {
    if (val == null) return;
    const diri = Math.floor((Math.floor(val / 22.5) + 1) / 2) % 8;

    if (dirTrendMap.has(diri)) {
      const count = (dirTrendMap.get(diri) ?? 0) + 1;
      dirTrendMap.set(diri, count);
      if (count > dirTrendMaxCount) {
        dirTrendMaxCount = count;
      }
    } else {
      dirTrendMap.set(diri, 1);
    }
  });

  const cardinal = getCardinal(dir);

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      {/* ── Left: Technical Radar Dial ─────────────────────────── */}
      <div className="flex flex-col py-1 basis-3/5 items-center justify-center">
        <div
          role="button"
          tabIndex={0}
          className="w-full max-w-[210px] aspect-square relative select-none transition-transform hover:scale-[1.02] cursor-pointer"
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.WINDDIR)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.WINDDIR);
            }
          }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <filter id="wind-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Radar Background grid */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              fill="rgba(18, 22, 33, 0.4)"
            />
            <circle
              cx={center}
              cy={center}
              r={radius * 0.65}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray="2 3"
              fill="none"
            />

            {/* Crosshair Lines */}
            <line
              x1={center}
              y1={center - radius}
              x2={center}
              y2={center + radius}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <line
              x1={center - radius}
              y1={center}
              x2={center + radius}
              y2={center}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />

            {/* Radial 15° & 45° Tick Marks */}
            {Array.from({ length: 24 }).map((_, i) => {
              const deg = i * 15;
              const isMajor = deg % 45 === 0;
              const tickLen = isMajor ? 7 : 3.5;
              const tickWidth = isMajor ? 1.5 : 1;
              const tickStroke = isMajor ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)";
              return (
                <line
                  key={deg}
                  x1={center}
                  y1={center - radius}
                  x2={center}
                  y2={center - radius + tickLen}
                  stroke={tickStroke}
                  strokeWidth={tickWidth}
                  transform={`rotate(${deg} ${center} ${center})`}
                />
              );
            })}

            {/* Historical Wind Direction Density Arcs */}
            {[...dirTrendMap.keys()].map((diri) =>
              [...Array(Math.floor((dirTrendMap.get(diri) ?? 0) / 4 + 1)).keys()].map(
                (count) => (
                  <path
                    key={`${diri}-${count}`}
                    d={describeArc(
                      center,
                      center,
                      radius - 9 - count * 2,
                      diri * 45 - 20,
                      diri * 45 + 20,
                    )}
                    stroke={color}
                    strokeWidth={2.5}
                    strokeOpacity={0.6}
                    fill="none"
                  />
                ),
              ),
            )}

            {/* Active Wind Direction Arrow / Needle */}
            {dir != null && (
              <g transform={`rotate(${dir} ${center} ${center})`} filter="url(#wind-glow)">
                {/* Needle path */}
                <polygon
                  points={`${center},${center - radius + 4} ${center - 5},${center - 28} ${center + 5},${center - 28}`}
                  fill={color}
                />
                {/* Opposing counterweight needle */}
                <polygon
                  points={`${center},${center + 26} ${center - 3},${center + 14} ${center + 3},${center + 14}`}
                  fill="rgba(255,255,255,0.3)"
                />
              </g>
            )}

            {/* Center Digital Readout Disc */}
            <circle
              cx={center}
              cy={center}
              r={24}
              fill="#0e121c"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
            />

            {/* Center Text: Cardinal Heading + Degrees */}
            <text
              x={center}
              y={center - 2}
              fontSize="12"
              fontWeight="700"
              letterSpacing="0.05em"
              textAnchor="middle"
              fill="#ffffff"
            >
              {cardinal}
            </text>
            <text
              x={center}
              y={center + 11}
              fontSize="9"
              fontWeight="500"
              textAnchor="middle"
              fill="rgba(232, 230, 227, 0.6)"
            >
              {dir != null ? `${Math.round(dir)}°` : "–"}
            </text>

            {/* Cardinal Labels on Perimeter */}
            <text
              x={center}
              y={offset - 8}
              fontSize="13"
              fontWeight="800"
              textAnchor="middle"
              fill={color}
            >
              N
            </text>
            <text
              x={center}
              y={width - 5}
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
            >
              S
            </text>
            <text
              x={8}
              y={center + 4}
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
            >
              W
            </text>
            <text
              x={width - 8}
              y={center + 4}
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
            >
              E
            </text>
          </svg>
        </div>
      </div>

      {/* ── Right: Wind Metrics Column ─────────────────────────── */}
      <div className="flex flex-col gap-3 basis-2/5">
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
