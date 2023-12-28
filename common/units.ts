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
