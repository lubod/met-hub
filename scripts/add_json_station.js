const { createClient } = require("redis");

async function main() {
  const client = createClient({ url: "redis://localhost:6380" });
  await client.connect();

  const stationJsonConfig = {
    id: "station_json",
    lat: 50.10,
    lon: 14.45,
    place: "Test JSON Ingest",
    type: "JSON",
    passkey: "jsonpasskey",
    public: true,
    owner: "local"
  };

  await client.hSet("ALL_STATIONS_CFG", "station_json", JSON.stringify(stationJsonConfig));
  console.log("Registered station_json in Redis ALL_STATIONS_CFG!");

  await client.disconnect();
}

main().catch(console.error);
