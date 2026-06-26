/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { action, makeObservable, observable } from "mobx";
import moment from "moment";
import { IStation } from "../../common/allStationsCfg";
import { avgWind } from "../../common/units";

export interface IGetForecastDataToDisplay {
  getDay(): string;
  getDay2(): string;
  getSymbolCode(): string;
  getAirTemperatureMax(): string;
  getAirTemperatureMin(): string;
  getPrecipitationAmount(): string;
  getWindSpeed(): string;
  getWindDir(): string;
  getCloudAreaFraction(): string;
  getTimestamp(): Date;
}

export class ForecastRow {
  timestamp: Date;

  air_pressure_at_sea_level: number;

  air_temperature: number;

  cloud_area_fraction: number;

  relative_humidity: number;

  wind_from_direction: number;

  wind_speed: number;

  precipitation_amount_row: number;

  precipitation_amount_1h: number;

  precipitation_amount_6h: number;

  symbol_code_1h: string;

  symbol_code_6h: string;

  symbol_code_12h: string;

  air_temperature_min_6h: number;

  air_temperature_max_6h: number;
}

export class ForecastDay implements IGetForecastDataToDisplay {
  timestamp: Date;

  air_temperature_min: number;

  air_temperature_max: number;

  precipitation_amount: number;

  wind_speed_max: number;

  wind_speed_min: number;

  symbol_code_00Z: string;

  symbol_code_06Z: string;

  symbol_code_12Z: string;

  symbol_code_18Z: string;

  symbol_code_day: string;

  symbol_code_night: string;

  cloud_area_fraction_avg: number;

  wind_dir_avg: number;

  rows: Array<ForecastRow>;

  getDay(): string {
    return moment(this.timestamp).format("ddd");
  }

  getDay2(): string {
    return moment(this.timestamp).format("Do");
  }

  getSymbolCode(): string {
    return this.symbol_code_day;
  }

  getAirTemperatureMin(): string {
    return this.air_temperature_min?.toFixed(0);
  }

  getAirTemperatureMax(): string {
    return this.air_temperature_max?.toFixed(0);
  }

  getPrecipitationAmount(): string {
    return this.precipitation_amount === 0
      ? "-"
      : this.precipitation_amount.toFixed(1);
  }

  getWindSpeed(): string {
    return (this.wind_speed_max * 3.6).toFixed(0);
  }

  getWindDir(): string {
    return this.wind_dir_avg.toFixed(0);
  }

  getCloudAreaFraction(): string {
    return this.cloud_area_fraction_avg.toFixed(0);
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}

export interface IForecastData {
  forecast: any;
  astronomicalData: any;
  sunrise: Date;
  sunset: Date;
  days: Map<string, ForecastDay>;
  domainTempMin: number;
  domainTempMax: number;
  loading: boolean;
  station: IStation;
}

export class Forecast6h implements IGetForecastDataToDisplay {
  timestamp: Date;

  symbol_code: string;

  air_temperature_min: number;

  air_temperature_max: number;

  precipitation_amount: number;

  wind_speed: number;

  wind_dir: number;

  cloud_area_fraction: number;

  constructor(
    timestamp: Date,
    symbol_code: string,
    air_temperature_min: number,
    air_temperature_max: number,
    precipitation_amount: number,
    wind_speed: number,
    wind_dir: number,
    cloud_area_fraction: number,
  ) {
    this.timestamp = timestamp;
    this.symbol_code = symbol_code;
    this.air_temperature_min = air_temperature_min;
    this.air_temperature_max = air_temperature_max;
    this.precipitation_amount = precipitation_amount;
    this.wind_speed = wind_speed;
    this.wind_dir = wind_dir;
    this.cloud_area_fraction = cloud_area_fraction;
  }

  getDay(): string {
    return moment(this.timestamp).format("ddd");
  }

  getDay2(): string {
    return moment(this.timestamp).format("HH");
  }

  getSymbolCode(): string {
    return this.symbol_code;
  }

  getAirTemperatureMax(): string {
    return this.air_temperature_max.toFixed(0);
  }

  getAirTemperatureMin(): string {
    return this.air_temperature_min.toFixed(0);
  }

  getPrecipitationAmount(): string {
    return this.precipitation_amount === 0
      ? "-"
      : this.precipitation_amount.toFixed(1);
  }

  getWindSpeed(): string {
    return (this.wind_speed * 3.6).toFixed(0);
  }

  getWindDir(): string {
    return this.wind_dir.toFixed(0);
  }

  getCloudAreaFraction(): string {
    return this.cloud_area_fraction.toFixed(0);
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}

export class Forecast1h implements IGetForecastDataToDisplay {
  timestamp: Date;

  symbol_code: string;

  air_temperature: number;

  precipitation_amount: number;

  wind_speed: number;

  wind_dir: number;

  cloud_area_fraction: number;

  constructor(
    timestamp: Date,
    symbol_code: string,
    air_temperature: number,
    precipitation_amount: number,
    wind_speed: number,
    wind_dir: number,
    cloud_area_fraction: number,
  ) {
    this.timestamp = timestamp;
    this.symbol_code = symbol_code;
    this.air_temperature = air_temperature;
    this.precipitation_amount = precipitation_amount;
    this.wind_speed = wind_speed;
    this.wind_dir = wind_dir;
    this.cloud_area_fraction = cloud_area_fraction;
  }

  getDay(): string {
    return moment(this.timestamp).format("ddd");
  }

  getDay2(): string {
    return moment(this.timestamp).format("HH");
  }

  getSymbolCode(): string {
    return this.symbol_code;
  }

  getAirTemperatureMax(): string {
    return this.air_temperature.toFixed(0);
  }

  getAirTemperatureMin(): string {
    return "-";
  }

  getPrecipitationAmount(): string {
    return this.precipitation_amount === 0
      ? "-"
      : this.precipitation_amount.toFixed(1);
  }

  getWindSpeed(): string {
    return (this.wind_speed * 3.6).toFixed(0);
  }

  getWindDir(): string {
    return this.wind_dir.toFixed(0);
  }

  getCloudAreaFraction(): string {
    return this.cloud_area_fraction.toFixed(0);
  }

  getTimestamp(): Date {
    return this.timestamp;
  }
}

export interface IForecastStep {
  display: string;
  hours: number;
}

export const forecastHours: Array<IForecastStep> = [
  { display: "24 hours", hours: 24 },
  { display: "6 hours", hours: 6 },
  { display: "1 hour", hours: 1 },
];

export default class ForecastData implements IForecastData {
  forecast: any = null;

  astronomicalData: any = null;

  sunrise: Date = null;

  sunset: Date = null;

  days: Map<string, ForecastDay> = new Map<string, ForecastDay>();

  domainTempMin: number = null;

  domainTempMax: number = null;

  loading: boolean = true;

  station: IStation = null;

  forecast_6h: Array<Forecast6h> = [];

  forecast_1h: Array<Forecast1h> = [];

  step: IForecastStep = forecastHours[0];

  offset1h: number = 0;

  offset6h: number = 0;

  rows: Array<ForecastRow> = [];

  constructor() {
    makeObservable(this, {
      days: observable,
      sunrise: observable,
      sunset: observable,
      loading: observable,
      station: observable,
      forecast_6h: observable,
      forecast_1h: observable,
      step: observable,
      offset1h: observable,
      offset6h: observable,
      setForecast: action,
      setAstronomicalData: action,
      setStation: action,
      setStep: action,
      setOffset1h: action,
      setOffset6h: action,
      setLoading: action,
      calculate: action,
    });
  }

  setStep(step: IForecastStep) {
    this.step = step;
  }

  setOffset1h(offset1h: number) {
    this.offset1h = offset1h;
  }

  setOffset6h(offset6h: number) {
    this.offset6h = offset6h;
  }

  setStation(newStation: IStation) {
    this.station = newStation;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setAstronomicalData(astronomicalData: any) {
    this.astronomicalData = astronomicalData;
    this.sunrise = new Date(astronomicalData.properties.sunrise.time);
    this.sunset = new Date(astronomicalData.properties.sunset.time);
  }

  calculate() {
    let dayIndex = 0;
    let precipitation_amount_uptoFirst6 = 0;
    let wind_dirs: number[] = [];

    // Calculate time differences/weights for each row in the timeseries
    const rowWeights = new Map<ForecastRow, number>();
    for (let i = 0; i < this.rows.length; i += 1) {
      const row = this.rows[i];
      let weight = 1;
      if (i < this.rows.length - 1) {
        const nextRow = this.rows[i + 1];
        const diffHours = (nextRow.timestamp.getTime() - row.timestamp.getTime()) / (1000 * 60 * 60);
        if (diffHours > 0) {
          weight = diffHours;
        }
      } else if (i > 0) {
        weight = rowWeights.get(this.rows[i - 1]) || 1;
      }
      rowWeights.set(row, weight);
    }

    if (this.rows.length >= 6) {
      const uptoFirst6 = 6 - (this.rows[0].timestamp.getUTCHours() % 6);
      for (let rowIndex = 0; rowIndex < uptoFirst6; rowIndex += 1) {
        precipitation_amount_uptoFirst6 += this.rows[rowIndex].precipitation_amount_1h;
      }
    }

    for (const day of this.days.values()) {
      day.air_temperature_max = Number.MIN_SAFE_INTEGER;
      day.air_temperature_min = Number.MAX_SAFE_INTEGER;
      day.wind_speed_max = Number.MIN_SAFE_INTEGER;
      day.wind_speed_min = Number.MAX_SAFE_INTEGER;
      day.cloud_area_fraction_avg = 0;
      day.precipitation_amount = 0;

      const isFirstDay = dayIndex === 0;

      if (isFirstDay && day.rows.length > 0) {
        day.symbol_code_day = day.rows[0].symbol_code_12h;
        day.precipitation_amount += precipitation_amount_uptoFirst6;
      }

      let cloudFractionSum = 0;
      let totalCloudWeight = 0;

      for (let rowIndex = 0; rowIndex < day.rows.length; rowIndex += 1) {
        const row = day.rows[rowIndex];
        if (day.wind_speed_max < row.wind_speed) {
          day.wind_speed_max = row.wind_speed;
        }
        if (day.wind_speed_min > row.wind_speed) {
          day.wind_speed_min = row.wind_speed;
        }
        if (day.air_temperature_max < row.air_temperature) {
          day.air_temperature_max = row.air_temperature;
        }
        if (day.air_temperature_min > row.air_temperature) {
          day.air_temperature_min = row.air_temperature;
        }

        wind_dirs.push(row.wind_from_direction);

        const weight = rowWeights.get(row) || 1;
        if (row.cloud_area_fraction != null && !isNaN(row.cloud_area_fraction)) {
          cloudFractionSum += row.cloud_area_fraction * weight;
          totalCloudWeight += weight;
        }

        const isFirstRowOfFirstDay = isFirstDay && rowIndex === 0;

        switch (row.timestamp.getUTCHours()) {
          case 0:
            day.symbol_code_00Z = row.symbol_code_6h;
            day.precipitation_amount += row.precipitation_amount_6h;
            break;
          case 6:
            day.symbol_code_06Z = row.symbol_code_6h;
            day.symbol_code_day = row.symbol_code_12h;
            day.precipitation_amount += row.precipitation_amount_6h;
            break;
          case 12:
            day.symbol_code_12Z = row.symbol_code_6h;
            day.precipitation_amount += row.precipitation_amount_6h;
            break;
          case 18:
            day.symbol_code_18Z = row.symbol_code_6h;
            day.symbol_code_night = row.symbol_code_12h;
            day.precipitation_amount += row.precipitation_amount_6h;
            break;
          default:
        }

        if (
          (row.timestamp.getUTCHours() % 6 === 0 || isFirstRowOfFirstDay) &&
          row.symbol_code_6h != null
        ) {
          this.forecast_6h.push(
            new Forecast6h(
              row.timestamp,
              row.symbol_code_6h,
              row.air_temperature_min_6h,
              row.air_temperature_max_6h,
              isFirstRowOfFirstDay
                ? precipitation_amount_uptoFirst6
                : row.precipitation_amount_6h,
              row.wind_speed,
              row.wind_from_direction,
              row.cloud_area_fraction,
            ),
          );
        }
        if (row.symbol_code_1h != null) {
          this.forecast_1h.push(
            new Forecast1h(
              row.timestamp,
              row.symbol_code_1h,
              row.air_temperature,
              row.precipitation_amount_1h,
              row.wind_speed,
              row.wind_from_direction,
              row.cloud_area_fraction,
            ),
          );
        }
      }

      day.cloud_area_fraction_avg = totalCloudWeight > 0 ? (cloudFractionSum / totalCloudWeight) : 0;
      day.wind_dir_avg = avgWind(wind_dirs);
      dayIndex += 1;
      wind_dirs = [];
    }
  }

  setForecast(newForecast: any) {
    this.days = new Map<string, ForecastDay>();
    this.forecast_1h = [];
    this.forecast_6h = [];
    this.rows = [];
    for (let i = 0; i < newForecast.properties.timeseries.length; i += 1) {
      const item = newForecast.properties.timeseries[i];
      const row = {} as ForecastRow;
      row.timestamp = new Date(item.time);
      row.air_pressure_at_sea_level = parseFloat(
        item.data.instant.details.air_pressure_at_sea_level,
      );
      row.air_temperature = parseFloat(
        item.data.instant.details.air_temperature,
      );
      row.cloud_area_fraction = parseFloat(
        item.data.instant.details.cloud_area_fraction,
      );
      row.relative_humidity = parseFloat(
        item.data.instant.details.relative_humidity,
      );
      row.wind_from_direction = parseFloat(
        item.data.instant.details.wind_from_direction,
      );
      row.wind_speed = parseFloat(item.data.instant.details.wind_speed);
      row.precipitation_amount_1h =
        item.data.next_1_hours != null
          ? parseFloat(item.data.next_1_hours.details.precipitation_amount)
          : null;
      row.precipitation_amount_6h =
        item.data.next_6_hours != null
          ? parseFloat(item.data.next_6_hours.details.precipitation_amount)
          : null;
      row.precipitation_amount_row =
        row.precipitation_amount_1h != null
          ? row.precipitation_amount_1h
          : row.precipitation_amount_6h;
      row.air_temperature_min_6h =
        item.data.next_6_hours != null
          ? parseFloat(item.data.next_6_hours.details.air_temperature_min)
          : null;
      row.air_temperature_max_6h =
        item.data.next_6_hours != null
          ? parseFloat(item.data.next_6_hours.details.air_temperature_max)
          : null;
      row.symbol_code_1h = item.data.next_1_hours?.summary.symbol_code;
      row.symbol_code_6h = item.data.next_6_hours?.summary.symbol_code;
      row.symbol_code_12h = item.data.next_12_hours?.summary.symbol_code;

      this.rows.push(row);

      let forecastDay: ForecastDay = this.days.get(
        row.timestamp.toDateString(),
      );
      if (forecastDay == null) {
        forecastDay = new ForecastDay();
        forecastDay.timestamp = row.timestamp;
        forecastDay.rows = [row];
        this.days.set(row.timestamp.toDateString(), forecastDay);
      } else {
        forecastDay.rows.push(row);
      }
    }

    this.calculate();

    // console.info("ROWS", this.rows);
    // console.info("DAYS", this.days);
    // console.info("1h", this.forecast_1h);
    // console.info("6h", this.forecast_6h);
    this.forecast = newForecast;
  }
}
