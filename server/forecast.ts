import moment from "moment";
import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect();

export async function getForecast(lat: string, lon: string) {
  const cacheKey = `FORECAST_CACHE_${lat}_${lon}`;
  const reply = await redisClient.get(cacheKey);
  // console.info(reply);
  if (reply != null) {
    const json = JSON.parse(reply);
    // console.info(json);
    if (Object.keys(json).length > 0) {
      console.info(cacheKey, json.properties.meta.updated_at);
      return json;
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
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const json = await response.json();
    redisClient.set(cacheKey, JSON.stringify(json), {
      EX: 3600,
    });
    return json;
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function getAstronomicalData(
  lat: string,
  lon: string,
  date: Date,
) {
  try {
    const cacheKey = `ASTRONOMICAL_DATA_CACHE_${lat}_${lon}_${moment(
      date,
    ).format("YYYY-DD-MM")}`;
    const reply = await redisClient.get(cacheKey);
    // console.info(reply);
    if (reply != null) {
      const json = JSON.parse(reply);
      // console.info(json);
      if (Object.keys(json).length > 0) {
        console.info(cacheKey);
        return json;
      }
    }
    const url = `https://api.met.no/weatherapi/sunrise/3.0/sun?lat=${lat}&lon=${lon}&date=${moment(
      date,
    ).format("YYYY-MM-DD")}&offset=+02:00`;
    console.info(`GET ${url}`);
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "met-hub.com",
      },
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const json = await response.json();
    redisClient.set(cacheKey, JSON.stringify(json), {
      EX: 3600,
    });
    return json;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
