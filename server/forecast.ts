import fetch from "node-fetch";
import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect();

async function getForecast(lat: string, lon: string) {
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
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
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

export default getForecast;
