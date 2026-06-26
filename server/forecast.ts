import redisClient from "./redisClient";

function formatDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export async function getForecast(lat: string, lon: string) {
  const cacheKey = `FORECAST_CACHE_${lat}_${lon}`;
  const reply = await redisClient.get(cacheKey);
  if (reply != null) {
    try {
      const json = JSON.parse(reply);
      if (Object.keys(json).length > 0) {
        console.info(cacheKey, json.properties.meta.updated_at);
        return json;
      }
    } catch {
      // corrupt cache entry – fall through to fetch
    }
  }
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
  console.info(`GET ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "met-hub.com",
      },
    });
    if (!response.ok) {
      throw new Error(`An error has occured: ${response.status}`);
    }
    const json = await response.json();
    if (!json?.properties?.timeseries) {
      throw new Error("Unexpected forecast response structure");
    }
    redisClient.set(cacheKey, JSON.stringify(json), { EX: 3600 });
    return json;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAstronomicalData(lat: string, lon: string, date: Date) {
  const dateStr = formatDate(date);
  const cacheKey = `ASTRONOMICAL_DATA_CACHE_${lat}_${lon}_${dateStr}`;
  const reply = await redisClient.get(cacheKey);
  if (reply != null) {
    try {
      const json = JSON.parse(reply);
      if (Object.keys(json).length > 0) {
        console.info(cacheKey);
        return json;
      }
    } catch {
      // corrupt cache entry – fall through to fetch
    }
  }
  const url = `https://api.met.no/weatherapi/sunrise/3.0/sun?lat=${lat}&lon=${lon}&date=${dateStr}&offset=+02:00`;
  console.info(`GET ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "met-hub.com",
      },
    });
    if (!response.ok) {
      throw new Error(`An error has occured: ${response.status}`);
    }
    const json = await response.json();
    if (!json?.properties) {
      throw new Error("Unexpected astronomical data response structure");
    }
    redisClient.set(cacheKey, JSON.stringify(json), { EX: 3600 });
    return json;
  } catch (e) {
    console.error(e);
    return null;
  }
}
