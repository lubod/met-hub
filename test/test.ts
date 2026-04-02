import assert from "assert";
import StationGoGenMe3900 from "../server/stationGoGenMe3900";
import { AllStationsCfg, IStation } from "../common/allStationsCfg";
import { StationType } from "../common/stationType";
import { GoGenMe3900Simulator } from "./goGenMe3900Simulator";
import { CSimulator } from "./simulator";
import { IMeasurement } from "../server/measurement";
import { Garni1025ArcusSimulator } from "./garni1025ArcusSimulator";
import StationGarni1025Arcus from "../server/stationGarni1025Arcus";
import redisClient from "../server/redisClient";

async function main(
  station: IStation,
  simulator: CSimulator,
  meas: IMeasurement,
) {
  const data1 = simulator.generateData(new Date(), station.passkey);
  const data2 = simulator.generateOffsetData(data1, 5);
  const data3 = simulator.generateOffsetData(data1, -5);

  const d = new Date();
  d.setUTCMilliseconds(0);
  const pgtime = `${d.getUTCFullYear()}-${
    d.getUTCMonth() + 1
  }-${d.getUTCDate()} ${d.getUTCHours()}:${d.getUTCMinutes()}`;

  data1.dateutc = `${pgtime}:${d.getUTCSeconds()}`;
  data2.dateutc = `${pgtime}:${d.getUTCSeconds() + 1}`;
  data3.dateutc = `${pgtime}:${d.getUTCSeconds() + 2}`;

  // pass station ID so simulators that post by ID can use it
  data1.stationID = station.id;
  data2.stationID = station.id;
  data3.stationID = station.id;

  console.info("Testing station", station.id, station.type);

  const datas = [data1, data2, data3];
  for (const data of datas) {
    // eslint-disable-next-line no-await-in-loop
    await simulator.postData(data);
    // eslint-disable-next-line no-await-in-loop
    const sd = await simulator.fetchStationData(station.id);
    const decoded = meas.decodeData(data, station.place).decoded;
    simulator.correctTimestamp(decoded, sd);
    assert.deepStrictEqual(sd, decoded);
    console.info("Redis OK", station.id);
  }
}

async function run() {
  await redisClient.connect();

  const allStationsCfg = new AllStationsCfg();
  await allStationsCfg.readCfg();

  const goGenID = allStationsCfg.getDefaultStationID();
  const garniID = allStationsCfg.getSecondDefaultStationID();

  if (goGenID != null) {
    const station = allStationsCfg.getStationByID(goGenID);
    if (station.type === StationType.GoGenMe3900) {
      const simulator = new GoGenMe3900Simulator();
      const meas = new StationGoGenMe3900(station.id);
      await main(station, simulator, meas);
    } else {
      console.info(`Skipping default station ${goGenID}: type ${station.type} is not ${StationType.GoGenMe3900}`);
    }
  } else {
    console.info("No default station configured, skipping GoGen test");
  }

  if (garniID != null) {
    const station = allStationsCfg.getStationByID(garniID);
    if (station.type === StationType.Garni1025Arcus) {
      const simulator = new Garni1025ArcusSimulator();
      const meas = new StationGarni1025Arcus(station.id);
      await main(station, simulator, meas);
    } else {
      console.info(`Skipping second station ${garniID}: type ${station.type} is not ${StationType.Garni1025Arcus}`);
    }
  } else {
    console.info("No second station configured, skipping Garni test");
  }

  console.info("All tests passed");
  await redisClient.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
