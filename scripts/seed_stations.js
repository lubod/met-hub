const { createClient } = require("redis");
const { Pool } = require("pg");

const stations = [
  {
    id: "station1",
    lat: 50.0875,
    lon: 14.4211,
    place: "Prague Observatory",
    type: "GoGen Me 3900",
    passkey: "localpasskey",
    public: true,
    owner: "system"
  },
  {
    id: "station2",
    lat: 46.8508,
    lon: 9.5319,
    place: "Alpine Peak (Chur)",
    type: "Garni 1025 Arcus",
    passkey: "garnipasskey",
    public: true,
    owner: "system"
  },
  {
    id: "station_ecowitt",
    lat: 48.1486,
    lon: 17.1077,
    place: "Bratislava Field",
    type: "Ecowitt",
    passkey: "ecowittpasskey",
    public: true,
    owner: "system"
  },
  {
    id: "station_json",
    lat: 59.9139,
    lon: 10.7522,
    place: "Oslo Fjord Station",
    type: "JSON",
    passkey: "jsonpasskey",
    public: true,
    owner: "system"
  }
];

async function seed() {
  // 1. Redis
  const redisClient = createClient({ url: "redis://localhost:6380" });
  await redisClient.connect();
  console.log("Connected to Redis at localhost:6380");

  for (const station of stations) {
    await redisClient.hSet("ALL_STATIONS_CFG", station.id, JSON.stringify(station));
    console.log(`✓ Seeded station in Redis: ${station.id} (${station.place}) [${station.type}]`);
  }

  const count = await redisClient.hLen("ALL_STATIONS_CFG");
  console.log(`Total stations in Redis ALL_STATIONS_CFG: ${count}`);
  await redisClient.disconnect();

  // 2. Postgres
  const pool = new Pool({
    host: "localhost",
    port: 15432,
    database: "postgres",
    user: "postgres"
  });

  const client = await pool.connect();
  console.log("Connected to PostgreSQL at localhost:15432");

  const now = Date.now();
  const stepMs = 5 * 60 * 1000; // 5 minute steps
  const totalSteps = 288; // 24 hours of data

  for (const station of stations) {
    const table = `station_${station.id}`;
    
    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS public."${table}" (
        "timestamp" timestamp with time zone NOT NULL,
        tempin numeric(4,1),
        humidityin numeric(3,0),
        pressurerel numeric(6,1),
        pressureabs numeric(6,1),
        temp numeric(4,1),
        humidity numeric(3,0),
        winddir numeric(3,0),
        windspeed numeric(4,1),
        windgust numeric(4,1),
        rainrate numeric(5,1),
        solarradiation numeric(6,1),
        uv numeric(2,0),
        eventrain numeric(5,1),
        hourlyrain numeric(5,1),
        dailyrain numeric(5,1),
        weeklyrain numeric(5,1),
        monthlyrain numeric(5,1),
        feelslike numeric(4,1),
        dewpt numeric(4,1),
        CONSTRAINT "${table}_pkey" PRIMARY KEY ("timestamp")
      );
    `);
    console.log(`✓ Ensured table: "${table}"`);

    // Insert 24h of history if empty
    const countRes = await client.query(`SELECT count(*) FROM "${table}"`);
    const rowCount = parseInt(countRes.rows[0].count, 10);

    if (rowCount < 50) {
      console.log(`Seeding 24h sample telemetry for ${table}...`);
      const baseTemp = station.id === "station2" ? 14.5 : station.id === "station_json" ? 17.2 : 22.8;
      
      for (let i = totalSteps; i >= 0; i--) {
        const t = new Date(now - i * stepMs);
        const hourOfDay = t.getUTCHours();
        // diurnal temp variation
        const tempVariation = Math.sin((hourOfDay - 6) * Math.PI / 12) * 5;
        const temp = Number((baseTemp + tempVariation + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const humidity = Math.min(95, Math.max(30, Math.round(65 - tempVariation * 2.5)));
        const windspeed = Number((4.0 + Math.sin(i / 10) * 3 + Math.random() * 2).toFixed(1));
        const windgust = Number((windspeed + 2.5 + Math.random() * 3).toFixed(1));
        const winddir = Math.round((140 + Math.sin(i / 15) * 60 + 360) % 360);
        const solarradiation = (hourOfDay >= 6 && hourOfDay <= 19) ? Number((Math.sin((hourOfDay - 6) * Math.PI / 13) * 650 + Math.random() * 20).toFixed(1)) : 0;
        const uv = (solarradiation > 100) ? Math.min(9, Math.max(1, Math.round(solarradiation / 100))) : 0;
        const pressureabs = Number((1012.0 + Math.cos(i / 40) * 4).toFixed(1));
        const pressurerel = Number((pressureabs + 3.5).toFixed(1));
        const rainrate = (i > 100 && i < 115) ? 1.2 : 0.0;
        const dailyrain = Number(((i < 100 ? 1.8 : 0.0)).toFixed(1));
        const dewpt = Number((temp - ((100 - humidity) / 5)).toFixed(1));
        const feelslike = temp;

        await client.query(`
          INSERT INTO "${table}" (
            timestamp, tempin, humidityin, pressurerel, pressureabs,
            temp, humidity, winddir, windspeed, windgust,
            rainrate, solarradiation, uv, eventrain, hourlyrain,
            dailyrain, weeklyrain, monthlyrain, feelslike, dewpt
          ) VALUES (
            $1, 21.5, 45, $2, $3,
            $4, $5, $6, $7, $8,
            $9, $10, $11, 0, 0,
            $12, 0, 0, $13, $14
          ) ON CONFLICT (timestamp) DO NOTHING
        `, [
          t.toISOString(), pressurerel, pressureabs,
          temp, humidity, winddir, windspeed, windgust,
          rainrate, solarradiation, uv,
          dailyrain, feelslike, dewpt
        ]);
      }
      console.log(`✓ Populated 24h history for ${table}`);
    }
  }

  client.release();
  await pool.end();
  console.log("All stations and database tables initialized successfully!");
}

seed().catch(console.error);
