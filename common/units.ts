export const propName = <T extends object>(obj: T): { [K in keyof T]: K } =>
  new Proxy(obj, {
    get(_, key) {
      return key;
    },
  }) as any;

export const deg2rad = (degrees: number) => degrees * (Math.PI / 180);

export const rad2deg = (radians: number) => radians * (180 / Math.PI);

export const round = (value: number, precision: number) => {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export const avgWind = (directions: number[]) => {
  let sinSum = 0;
  let cosSum = 0;
  directions.forEach((value) => {
    sinSum += Math.sin(deg2rad(value));
    cosSum += Math.cos(deg2rad(value));
  });
  return round((rad2deg(Math.atan2(sinSum, cosSum)) + 360) % 360, 0);
};

export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const calculateDewPoint = (temp: number | null, humidity: number | null): number | null => {
  if (temp == null || humidity == null) return null;
  const b = 17.67;
  const c = 243.5;
  const lambda = Math.log(humidity / 100) + (b * temp) / (c + temp);
  return round((c * lambda) / (b - lambda), 1);
};

export const DEFAULT_LAT = 50.08;

export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const calculateRa = (latitude: number, dayOfYear: number): number => {
  const phi = deg2rad(latitude);
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * dayOfYear) / 365);
  const delta = 0.409 * Math.sin(((2 * Math.PI * dayOfYear) / 365) - 1.39);
  
  const omegaTemp = -Math.tan(phi) * Math.tan(delta);
  let omegaS = 0;
  if (omegaTemp <= -1) {
    omegaS = Math.PI;
  } else if (omegaTemp >= 1) {
    omegaS = 0;
  } else {
    omegaS = Math.acos(omegaTemp);
  }
  
  const Ra = 37.586 * dr * (omegaS * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(omegaS));
  return Ra;
};

export const calculatePenmanMonteithInstantaneousET0 = (
  temp: number | null,
  humidity: number | null,
  windSpeedKmH: number | null,
  solarRadiationWm2: number | null,
  pressureHpa: number | null,
  latitude: number,
  dayOfYear: number,
): number | null => {
  if (temp == null || humidity == null) return null;
  
  const T = temp;
  const u2 = windSpeedKmH != null ? windSpeedKmH / 3.6 : 2.0;
  const Rs = solarRadiationWm2 != null ? solarRadiationWm2 * 0.0864 : 0;
  const es = 0.6108 * Math.exp((17.27 * T) / (T + 237.3));
  const ea = (es * humidity) / 100;
  const deltaVal = (4098 * es) / (T + 237.3) ** 2;
  const P = (pressureHpa != null ? pressureHpa : 1013.25) / 10;
  const gamma = 0.000665 * P;
  
  const Ra = calculateRa(latitude, dayOfYear);
  const Rso = 0.75 * Ra;
  
  let fcloud = 0.5;
  if (Rs > 0 && Rso > 0) {
    fcloud = Math.min(1.0, Rs / Rso);
  }
  
  const sigma = 4.903e-9;
  const Tk = T + 273.15;
  const Rnl = sigma * (Tk ** 4) * (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * fcloud - 0.35);
  const Rn = (1 - 0.23) * Rs - Rnl;
  const G = 0;
  
  const num = 0.408 * deltaVal * (Rn - G) + gamma * (900 / (T + 273.15)) * u2 * (es - ea);
  const den = deltaVal + gamma * (1 + 0.34 * u2);
  
  return round(Math.max(0, num / den), 3);
};

export const calculateHargreavesET0 = (
  tmin: number,
  tmax: number,
  latitude: number,
  dayOfYear: number,
): number => {
  const Tmean = (tmax + tmin) / 2;
  const Ra = calculateRa(latitude, dayOfYear);
  const RaEvap = 0.408 * Ra;
  const ET0 = 0.0023 * RaEvap * (Tmean + 17.8) * Math.sqrt(Math.max(0, tmax - tmin));
  return round(Math.max(0, ET0), 3);
};

/**
 * Calculates "Feels Like" temperature.
 * Uses Wind Chill for cold temps (< 10C) and Heat Index for warm temps (> 26.7C).
 * @param temp Celsius
 * @param humidity Percentage
 * @param windSpeed Km/h
 */
export const calculateFeelsLike = (
  temp: number | null,
  humidity: number | null,
  windSpeed: number | null,
): number | null => {
  if (temp == null) return null;

  // Wind Chill (for temp <= 10C and wind > 4.8 km/h)
  if (temp <= 10 && windSpeed != null && windSpeed > 4.8) {
    return round(
      13.12 +
        0.6215 * temp -
        11.37 * windSpeed**0.16 +
        0.3965 * temp * windSpeed**0.16,
      1,
    );
  }

  // Heat Index (for temp >= 26.7C)
  if (temp >= 26.7 && humidity != null && humidity >= 40) {
    // Steadman's approximation / Rothfusz regression
    const T = temp * 1.8 + 32; // Convert to Fahrenheit
    const R = humidity;
    let hi = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + R * 0.094);

    if (hi >= 80) {
      hi =
        -42.379 +
        2.04901523 * T +
        10.14333127 * R -
        0.22475541 * T * R -
        0.00683783 * T * T -
        0.05481717 * R * R +
        0.00122874 * T * T * R +
        0.00085282 * T * R * R -
        0.00000199 * T * T * R * R;

      if (R < 13 && T >= 80 && T <= 112) {
        hi -= ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
      } else if (R > 85 && T >= 80 && T <= 87) {
        hi += ((R - 85) / 10) * ((87 - T) / 5);
      }
    }
    return round((hi - 32) / 1.8, 1);
  }

  // Steadman's Apparent Temperature for moderate climates / when thresholds are not met
  if (humidity != null) {
    const wSpeed = windSpeed ?? 0;
    const v = wSpeed / 3.6; // Convert km/h to m/s
    const e = (humidity / 100) * 6.105 * Math.exp((17.27 * temp) / (237.7 + temp));
    const at = temp + 0.33 * e - 0.7 * v - 4.0;
    return round(at, 1);
  }

  return temp;
};
