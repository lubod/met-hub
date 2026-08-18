/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import ForecastChart from "./forecastChart";
import {
  Forecast1h,
  Forecast6h,
  ForecastDay,
  IGetForecastDataToDisplay,
} from "./forecastData";
import ForecastChartTemp from "./forecastChartTemp";
import ForecastCtrl from "./forecastCtrl";
import ForecastStepsList from "./forecastStepList";

const FORECAST_COLORS: Record<string, string> = {
  gray2: "#8b9dc3",
  orange: "#e07856",
  blue: "#6ba3a8",
  light: "#e8e6e3",
  purple: "#8b9dc3",
};

type CellProps = {
  value: string;
  color: string;
  unit?: string;
  colWidth: number;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  maxLimit1?: number;
  maxLimit2?: number;
  maxLimit3?: number;
  minLimit1?: number;
  minLimit2?: number;
  minLimit3?: number;
};

function Cell({
  value,
  color,
  unit,
  colWidth,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  maxLimit1,
  maxLimit2,
  maxLimit3,
  minLimit1,
  minLimit2,
  minLimit3,
}: CellProps) {
  const val = parseFloat(value);
  let finalColor = color;
  if (color === "orange" && val < 0) finalColor = "blue";
  const hex = FORECAST_COLORS[finalColor] ?? "#ffffff";

  let bgOpacity = 0;

  if (color === "orange" && !Number.isNaN(val)) {
    if (val > 0) {
      bgOpacity = Math.min((val / 35) * 0.7, 0.7);
    } else if (val < 0) {
      bgOpacity = Math.min((Math.abs(val) / 20) * 0.7, 0.7);
    }
  } else if (color === "purple" && !Number.isNaN(val)) {
    bgOpacity = Math.min((val / 60) * 0.6, 0.6);
  } else if (!Number.isNaN(val)) {
    if (maxLimit1 != null && val > maxLimit1) bgOpacity = 0.15;
    if (maxLimit2 != null && val > maxLimit2) bgOpacity = 0.3;
    if (maxLimit3 != null && val > maxLimit3) bgOpacity = 0.55;

    if (minLimit1 != null && val < minLimit1) bgOpacity = 0.15;
    if (minLimit2 != null && val < minLimit2) bgOpacity = 0.3;
    if (minLimit3 != null && val < minLimit3) bgOpacity = 0.55;
  }

  let formattedValue = value;
  if (unit === "°" && value !== "-" && !Number.isNaN(val)) {
    formattedValue = `${val > 0 ? `+${val}` : val}°`;
  } else if (unit === "%" && value !== "-" && !Number.isNaN(val)) {
    formattedValue = `${val}%`;
  } else if (unit === "mm" && value !== "-" && !Number.isNaN(val)) {
    formattedValue = `${val}`;
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`text-center text-light border-s text-xs py-2.5 flex-shrink-0 font-medium select-none transition-all duration-150 flex items-center justify-center ${
        isHovered ? "bg-white/[0.14] !border-cyan/40 font-semibold" : ""
      }`}
      style={{
        width: colWidth,
        minWidth: colWidth,
        maxWidth: colWidth,
        borderLeftColor: isHovered ? undefined : "rgba(255, 255, 255, 0.05)",
        backgroundColor:
          !isHovered && bgOpacity > 0
            ? `${hex}${Math.round(bgOpacity * 255)
                .toString(16)
                .padStart(2, "0")}`
            : undefined,
      }}
    >
      <span className="tabular-nums">{formattedValue}</span>
    </div>
  );
}

type RowsProps = {
  data: Array<IGetForecastDataToDisplay>;
  hours: number;
  totalWidth: number;
  colWidth: number;
  hoveredCol: number | null;
  setHoveredCol: (idx: number | null) => void;
};

function MyRows1({
  data,
  hours,
  totalWidth,
  colWidth,
  hoveredCol,
  setHoveredCol,
}: RowsProps) {
  const size = "32px";

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border border-white/5 bg-white/[0.015]"
      style={{ width: totalWidth, minWidth: totalWidth, maxWidth: totalWidth }}
    >
      {/* Day Row */}
      <div
        className="flex flex-row font-semibold text-light/90 border-b border-white/5"
        style={{ width: totalWidth }}
      >
        {data.map((item: IGetForecastDataToDisplay, idx: number) => (
          <Cell
            key={`day-${item.getDay()}-${item.getDay2()}-${item.getTimestamp()?.getTime()}`}
            value={item.getDay()}
            color="gray2"
            colWidth={colWidth}
            isHovered={hoveredCol === idx}
            onMouseEnter={() => setHoveredCol(idx)}
            onMouseLeave={() => setHoveredCol(null)}
          />
        ))}
      </div>

      {/* Date / Time Row */}
      <div
        className="flex flex-row text-light/60 text-[11px] border-b border-white/5"
        style={{ width: totalWidth }}
      >
        {data.map((item: IGetForecastDataToDisplay, idx: number) => (
          <Cell
            key={`day2-${item.getDay()}-${item.getDay2()}-${item.getTimestamp()?.getTime()}`}
            value={item.getDay2()}
            color="gray2"
            colWidth={colWidth}
            isHovered={hoveredCol === idx}
            onMouseEnter={() => setHoveredCol(idx)}
            onMouseLeave={() => setHoveredCol(null)}
          />
        ))}
      </div>

      {/* Weather Icon Row */}
      <div
        className="flex flex-row py-2 border-b border-white/5"
        style={{ width: totalWidth }}
      >
        {data.map((item: IGetForecastDataToDisplay, idx: number) => (
          <div
            className={`text-center border-s flex items-center justify-center flex-shrink-0 transition-transform ${
              hoveredCol === idx
                ? "bg-white/[0.14] scale-110 !border-cyan/40"
                : ""
            }`}
            style={{
              width: colWidth,
              minWidth: colWidth,
              maxWidth: colWidth,
              borderLeftColor:
                hoveredCol === idx ? undefined : "rgba(255, 255, 255, 0.05)",
            }}
            key={`sym-${item.getDay()}-${item.getDay2()}-${item.getTimestamp()?.getTime()}`}
            onMouseEnter={() => setHoveredCol(idx)}
            onMouseLeave={() => setHoveredCol(null)}
          >
            {item.getSymbolCode() != null && (
              <img
                width={size}
                height={size}
                src={`svg/${item.getSymbolCode()}.svg`}
                alt={item.getSymbolCode()}
                className="drop-shadow-md"
              />
            )}
            {item.getSymbolCode() == null && (
              <span className="text-light/40">-</span>
            )}
          </div>
        ))}
      </div>

      {/* Max Temperature Row */}
      <div className="flex flex-row" style={{ width: totalWidth }}>
        {data.map((item: IGetForecastDataToDisplay, idx: number) => (
          <Cell
            key={`tmax-${item.getDay()}-${item.getDay2()}-${item.getTimestamp()?.getTime()}`}
            value={item.getAirTemperatureMax()}
            color="orange"
            unit="°"
            colWidth={colWidth}
            isHovered={hoveredCol === idx}
            onMouseEnter={() => setHoveredCol(idx)}
            onMouseLeave={() => setHoveredCol(null)}
            maxLimit1={24}
            maxLimit2={29}
            maxLimit3={34}
            minLimit1={0}
            minLimit2={-10}
            minLimit3={-20}
          />
        ))}
      </div>

      {/* Min Temperature Row (for 24h and 6h modes) */}
      {hours !== 1 && (
        <div
          className="flex flex-row border-t border-white/5"
          style={{ width: totalWidth }}
        >
          {data.map((item: IGetForecastDataToDisplay, idx: number) => (
            <Cell
              key={`tmin-${item.getDay()}-${item.getDay2()}-${item.getTimestamp()?.getTime()}`}
              value={item.getAirTemperatureMin()}
              color="orange"
              unit="°"
              colWidth={colWidth}
              isHovered={hoveredCol === idx}
              onMouseEnter={() => setHoveredCol(idx)}
              onMouseLeave={() => setHoveredCol(null)}
              maxLimit1={18}
              maxLimit2={21}
              maxLimit3={24}
              minLimit1={0}
              minLimit2={-10}
              minLimit3={-20}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MyRowsRainCloud({
  data,
  totalWidth,
  colWidth,
  hoveredCol,
  setHoveredCol,
}: RowsProps) {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border border-white/5 bg-white/[0.015]"
      style={{ width: totalWidth, minWidth: totalWidth, maxWidth: totalWidth }}
    >
      {/* Rain Row */}
      <div
        className="flex flex-row border-b border-white/5"
        style={{ width: totalWidth }}
      >
        {data.map((item: IGetForecastDataToDisplay, idx: number) => (
          <Cell
            value={item.getPrecipitationAmount()}
            color="blue"
            unit="mm"
            colWidth={colWidth}
            key={`rain-${item.getDay()}-${item.getDay2()}-${item.getTimestamp()?.getTime()}`}
            isHovered={hoveredCol === idx}
            onMouseEnter={() => setHoveredCol(idx)}
            onMouseLeave={() => setHoveredCol(null)}
            maxLimit1={0.01}
            maxLimit2={3}
            maxLimit3={10}
          />
        ))}
      </div>

      {/* Clouds Row */}
      <div className="flex flex-row" style={{ width: totalWidth }}>
        {data.map((item: IGetForecastDataToDisplay, idx: number) => (
          <Cell
            key={`cloud-${item.getDay()}-${item.getDay2()}-${item.getTimestamp()?.getTime()}`}
            value={item.getCloudAreaFraction()}
            color="light"
            unit="%"
            colWidth={colWidth}
            isHovered={hoveredCol === idx}
            onMouseEnter={() => setHoveredCol(idx)}
            onMouseLeave={() => setHoveredCol(null)}
            maxLimit1={50}
            maxLimit2={70}
            maxLimit3={90}
          />
        ))}
      </div>
    </div>
  );
}

function MyRowsWind({
  data,
  totalWidth,
  colWidth,
  hoveredCol,
  setHoveredCol,
}: RowsProps) {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden border border-white/5 bg-white/[0.015]"
      style={{ width: totalWidth, minWidth: totalWidth, maxWidth: totalWidth }}
    >
      {/* Wind Speed Row */}
      <div
        className="flex flex-row border-b border-white/5"
        style={{ width: totalWidth }}
      >
        {data.map((item: IGetForecastDataToDisplay, idx: number) => (
          <Cell
            key={`wind-${item.getDay()}-${item.getDay2()}-${item.getTimestamp()?.getTime()}`}
            value={item.getWindSpeed()}
            color="purple"
            colWidth={colWidth}
            isHovered={hoveredCol === idx}
            onMouseEnter={() => setHoveredCol(idx)}
            onMouseLeave={() => setHoveredCol(null)}
            maxLimit1={19}
            maxLimit2={29}
            maxLimit3={39}
          />
        ))}
      </div>

      {/* Wind Direction Row */}
      <div className="flex flex-row py-1" style={{ width: totalWidth }}>
        {data.map((item: IGetForecastDataToDisplay, idx: number) => {
          const windSpeed = parseFloat(item.getWindSpeed());
          const hex = FORECAST_COLORS.purple;
          const bgOpacity = Math.min((windSpeed / 60) * 0.7, 0.7);

          return (
            <div
              className={`text-center border-s flex items-center justify-center flex-shrink-0 py-2 transition-all ${
                hoveredCol === idx
                  ? "bg-white/[0.14] !border-cyan/40 scale-105"
                  : ""
              }`}
              key={`wdir-${item.getDay()}-${item.getDay2()}-${item.getTimestamp()?.getTime()}`}
              onMouseEnter={() => setHoveredCol(idx)}
              onMouseLeave={() => setHoveredCol(null)}
              style={{
                width: colWidth,
                minWidth: colWidth,
                maxWidth: colWidth,
                borderLeftColor:
                  hoveredCol === idx ? undefined : "rgba(255, 255, 255, 0.05)",
                backgroundColor:
                  hoveredCol !== idx && bgOpacity > 0
                    ? `${hex}${Math.round(bgOpacity * 255)
                        .toString(16)
                        .padStart(2, "0")}`
                    : undefined,
              }}
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/15 shadow-sm">
                <svg width="16px" height="16px" viewBox="0 0 24 24">
                  <polygon
                    points="8 4, 12 20, 16 4"
                    fill="rgba(255, 255, 255, 0.95)"
                    stroke="rgba(0, 0, 0, 0.4)"
                    strokeWidth="0.5"
                    transform={`rotate(${item.getWindDir()} 12 12)`}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Props = {
  days: Array<ForecastDay>;
  forecast_6h: Array<Forecast6h>;
  forecast_1h: Array<Forecast1h>;
  forecastCtrl: ForecastCtrl;
};

const ForecastCharts = observer(
  ({ days, forecast_6h, forecast_1h, forecastCtrl }: Props) => {
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return undefined;
      const update = () => {
        if (el) {
          setContainerWidth(el.clientWidth);
        }
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      window.addEventListener("resize", update);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", update);
      };
    }, []);

    let lastTimestamp = null;
    let firstTimestamp = null;
    let cols;
    const { hours } = forecastCtrl.forecastData.step;
    switch (hours) {
      case 1:
        cols = forecast_1h.length;
        break;
      case 6:
        cols = forecast_6h.length;
        break;
      default:
        cols = days.length;
    }

    if (forecast_6h.length > 0 && hours === 6) {
      firstTimestamp = forecast_6h[0].timestamp;
      lastTimestamp = new Date(
        forecast_6h[forecast_6h.length - 1].timestamp.getTime() + 6 * 3600000,
      );
    }

    if (forecast_1h.length > 0 && hours === 1) {
      firstTimestamp = forecast_1h[0].timestamp;
      lastTimestamp = new Date(
        forecast_1h[forecast_1h.length - 1].timestamp.getTime() + 1 * 3600000,
      );
    }

    if (days.length > 0 && hours === 24) {
      firstTimestamp = new Date(days[0].timestamp);
      firstTimestamp.setHours(0, 0, 0, 0);
      lastTimestamp = new Date(
        firstTimestamp.getTime() + days.length * 24 * 3600000,
      );
    }

    console.debug(
      firstTimestamp,
      lastTimestamp,
      forecastCtrl.forecastData.offset1h,
    );

    const dataToDisplay =
      hours === 24 ? days : hours === 6 ? forecast_6h : forecast_1h;

    const minRequiredWidth = cols * 44;
    const availableContentWidth = Math.max(0, containerWidth - 32);
    const shouldExpand = availableContentWidth > minRequiredWidth;
    const totalWidth = shouldExpand ? availableContentWidth : minRequiredWidth;
    const colWidth = cols > 0 ? totalWidth / cols : 44;
    const cardWidth = shouldExpand ? "100%" : `${totalWidth + 32}px`;

    return (
      <div className="flex flex-col gap-6" ref={containerRef}>
        <div className="flex flex-row justify-center">
          <ForecastStepsList forecastCtrl={forecastCtrl} />
        </div>

        {/* Single continuous horizontal scroll container */}
        <div className="flex flex-col overflow-x-auto pb-4 overscroll-x-contain touch-pan-y">
          <div
            className="flex flex-col gap-8"
            style={{ width: cardWidth, minWidth: cardWidth }}
          >
            {/* 1. Temperature & Conditions Card */}
            <div
              className="glass-card !p-4 rounded-2xl border border-white/10 flex flex-col shadow-sm"
              style={{ width: cardWidth, minWidth: cardWidth }}
            >
              <MyRows1
                data={dataToDisplay}
                hours={hours}
                totalWidth={totalWidth}
                colWidth={colWidth}
                hoveredCol={hoveredCol}
                setHoveredCol={setHoveredCol}
              />
              {firstTimestamp != null && lastTimestamp != null && (
                <div className="mt-5">
                  <ForecastChartTemp
                    data={days}
                    lastTimestamp={lastTimestamp}
                    firstTimestamp={firstTimestamp}
                    hours={forecastCtrl.forecastData.step.hours}
                    offset6h={forecastCtrl.forecastData.offset6h}
                    width={totalWidth}
                  />
                </div>
              )}
            </div>

            {/* 2. Precipitation & Cloud Cover Card */}
            <div
              className="glass-card !p-4 rounded-2xl border border-white/10 flex flex-col shadow-sm"
              style={{ width: cardWidth, minWidth: cardWidth }}
            >
              <MyRowsRainCloud
                data={dataToDisplay}
                hours={hours}
                totalWidth={totalWidth}
                colWidth={colWidth}
                hoveredCol={hoveredCol}
                setHoveredCol={setHoveredCol}
              />
              {firstTimestamp != null && lastTimestamp != null && (
                <div className="mt-5">
                  <ForecastChart
                    data={days}
                    lastTimestamp={lastTimestamp}
                    firstTimestamp={firstTimestamp}
                    hours={forecastCtrl.forecastData.step.hours}
                    offset6h={forecastCtrl.forecastData.offset6h}
                    width={totalWidth}
                    type="rain_cloud"
                  />
                </div>
              )}
            </div>

            {/* 3. Wind Speed & Direction Card */}
            <div
              className="glass-card !p-4 rounded-2xl border border-white/10 flex flex-col shadow-sm"
              style={{ width: cardWidth, minWidth: cardWidth }}
            >
              <MyRowsWind
                data={dataToDisplay}
                hours={hours}
                totalWidth={totalWidth}
                colWidth={colWidth}
                hoveredCol={hoveredCol}
                setHoveredCol={setHoveredCol}
              />
              {firstTimestamp != null && lastTimestamp != null && (
                <div className="mt-5">
                  <ForecastChart
                    data={days}
                    lastTimestamp={lastTimestamp}
                    firstTimestamp={firstTimestamp}
                    hours={forecastCtrl.forecastData.step.hours}
                    offset6h={forecastCtrl.forecastData.offset6h}
                    width={totalWidth}
                    type="wind"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default ForecastCharts;
