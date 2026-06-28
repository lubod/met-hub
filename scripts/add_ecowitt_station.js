const { createClient } = require("redis");

async function main() {
  const client = createClient({ url: "redis://localhost:6380" });
  await client.connect();

  const stationEcowittConfig = {
    id: "station_ecowitt",
    lat: 48.15,
    lon: 17.12,
    place: "Test Ecowitt Ingest",
    type: "Ecowitt",
    passkey: "ecowittpasskey",
    public: true,
    owner: "local"
  };

  await client.hSet("ALL_STATIONS_CFG", "station_ecowitt", JSON.stringify(stationEcowittConfig));
  console.log("Registered station_ecowitt in Redis ALL_STATIONS_CFG!");

  await client.disconnect();
}

main().catch(console.error);
