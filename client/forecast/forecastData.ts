/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import { action, makeObservable, observable } from "mobx";

export interface IForecastRow {
  timestamp: Date;
  air_pressure_at_sea_level: string;
  air_temperature: string;
  cloud_area_fraction: string;
  relative_humidity: string;
  wind_from_direction: string;
  wind_speed: string;
  precipitation_amount: string;
  symbol_code_1h: string;
  symbol_code_6h: string;
}

export interface IForecastDay {
  timestamp: Date;
  air_temperature_min: number;
  air_temperature_max: number;
  precipitation_amount_sum: number;
  wind_speed_max: number;
  symbol_code_00: string;
  symbol_code_06: string;
  symbol_code_12: string;
  symbol_code_18: string;
  forecastRows: IForecastRow[];
  cloud_area_fraction_sum: number;
}

export default class ForecastData {
  forecast: any = null;

  coordinates: string[] = [];

  astronomicalData: any = null;

  sunrise: Date = null;

  sunset: Date = null;

  days: Map<string, IForecastDay> = new Map<string, IForecastDay>();

  loading: boolean = true;

  constructor() {
    makeObservable(this, {
      coordinates: observable,
      days: observable,
      sunrise: observable,
      sunset: observable,
      loading: observable,
      setForecast: action,
      setAstronomicalData: action,
    });
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setAstronomicalData(astronomicalData: any) {
    this.astronomicalData = astronomicalData;
    this.sunrise = new Date(
      astronomicalData.astrodata.location.time[0].sunrise._attributes.time
    );
    this.sunset = new Date(
      astronomicalData.astrodata.location.time[0].sunset._attributes.time
    );
  }

  setForecast(newForecast: any) {
    this.days = new Map<string, IForecastDay>();
    this.coordinates = newForecast.geometry.coordinates;
    for (const item of newForecast.properties.timeseries) {
      const timestamp: Date = new Date(item.time);
      const {
        air_pressure_at_sea_level,
        air_temperature,
        cloud_area_fraction,
        relative_humidity,
        wind_from_direction,
        wind_speed,
      } = item.data.instant.details;

      let precipitation_amount = "0";
      if (item.data.next_1_hours != null) {
        precipitation_amount =
          item.data.next_1_hours.details.precipitation_amount;
      } else if (item.data.next_6_hours != null) {
        precipitation_amount =
          item.data.next_6_hours.details.precipitation_amount;
      }
      const symbol_code_1h = item.data.next_1_hours?.summary.symbol_code;
      const symbol_code_6h = item.data.next_6_hours?.summary.symbol_code;
      const forecastRow: IForecastRow = {
        timestamp,
        air_pressure_at_sea_level,
        air_temperature,
        cloud_area_fraction,
        relative_humidity,
        wind_from_direction,
        wind_speed,
        precipitation_amount,
        symbol_code_1h,
        symbol_code_6h,
      };
      let forecastDay: IForecastDay = this.days.get(timestamp.toDateString());
      const air_temperature_f = parseFloat(forecastRow.air_temperature);
      const wind_speed_f = parseFloat(forecastRow.wind_speed);
      if (forecastDay == null) {
        forecastDay = {
          timestamp,
          air_temperature_min: air_temperature_f,
          air_temperature_max: air_temperature_f,
          precipitation_amount_sum: 0,
          wind_speed_max: wind_speed_f,
          symbol_code_00: null,
          symbol_code_06: null,
          symbol_code_12: null,
          symbol_code_18: null,
          forecastRows: [forecastRow],
          cloud_area_fraction_sum: cloud_area_fraction,
        };
      } else {
        forecastDay.forecastRows.push(forecastRow);
        if (air_temperature_f > forecastDay.air_temperature_max) {
          forecastDay.air_temperature_max = air_temperature_f;
        }
        if (air_temperature_f < forecastDay.air_temperature_min) {
          forecastDay.air_temperature_min = air_temperature_f;
        }
        forecastDay.precipitation_amount_sum += parseFloat(
          forecastRow.precipitation_amount
        );
        forecastDay.cloud_area_fraction_sum += parseFloat(
          forecastRow.cloud_area_fraction
        );
        if (wind_speed_f > forecastDay.wind_speed_max) {
          forecastDay.wind_speed_max = wind_speed_f;
        }
      }
      if (timestamp.getUTCHours() === 0)
        forecastDay.symbol_code_00 = symbol_code_6h;
      if (timestamp.getUTCHours() === 6)
        forecastDay.symbol_code_06 = symbol_code_6h;
      if (timestamp.getUTCHours() === 12)
        forecastDay.symbol_code_12 = symbol_code_6h;
      if (timestamp.getUTCHours() === 18)
        forecastDay.symbol_code_18 = symbol_code_6h;
      this.days.set(timestamp.toDateString(), forecastDay);
    }
    this.forecast = newForecast;
  }
}
