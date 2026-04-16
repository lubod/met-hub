// eslint-disable-next-line import/prefer-default-export
export const propName = (obj: any) =>
  new Proxy(obj, {
    get(_, key) {
      return key;
    },
  });

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

export const calculateDewPoint = (temp: number, humidity: number): number => {
  if (temp == null || humidity == null) return null;
  const b = 17.67;
  const c = 243.5;
  const lambda = Math.log(humidity / 100) + (b * temp) / (c + temp);
  return round((c * lambda) / (b - lambda), 1);
};

/**
 * Calculates "Feels Like" temperature.
 * Uses Wind Chill for cold temps (< 10C) and Heat Index for warm temps (> 26.7C).
 * @param temp Celsius
 * @param humidity Percentage
 * @param windSpeed Km/h
 */
export const calculateFeelsLike = (
  temp: number,
  humidity: number,
  windSpeed: number,
): number => {
  if (temp == null) return null;

  // Wind Chill (for temp <= 10C and wind > 4.8 km/h)
  if (temp <= 10 && windSpeed > 4.8) {
    return round(
      13.12 +
        0.6215 * temp -
        11.37 * Math.pow(windSpeed, 0.16) +
        0.3965 * temp * Math.pow(windSpeed, 0.16),
      1,
    );
  }

  // Heat Index (for temp >= 26.7C)
  if (temp >= 26.7 && humidity >= 40) {
    // Steadman's approximation / Rothfusz regression
    const T = temp * 1.8 + 32; // Convert to Fahrenheit
    const R = humidity;
    let hi =
      0.5 * (T + 61.0 + (T - 68.0) * 1.2 + R * 0.094);

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

  return temp;
};
