const { createClient } = require("redis");

async function run() {
  const client = createClient({ url: "redis://localhost:6380" });
  await client.connect();
  
  const station1 = {
    id: "station1",
    lat: 50.08,
    lon: 14.43,
    place: "Test Station",
    type: "GoGen Me 3900",
    passkey: "localpasskey",
    public: true,
    owner: "local"
  };

  const station2 = {
    id: "station2",
    lat: 50.09,
    lon: 14.44,
    place: "Test Station 2",
    type: "Garni 1025 Arcus",
    passkey: "garnipasskey",
    public: true,
    owner: "local"
  };

  await client.hSet("ALL_STATIONS_CFG", "station1", JSON.stringify(station1));
  await client.hSet("ALL_STATIONS_CFG", "station2", JSON.stringify(station2));

  console.log("Stations registered in Redis successfully!");
  await client.disconnect();
}

run().catch(console.error);
