import assert from "assert";
import StationGoGenMe3900 from "../server/stationGoGenMe3900";
import { AllStationsCfg, IStation } from "../common/allStationsCfg";
import { GoGenMe3900Simulator } from "./goGenMe3900Simulator";
import { CSimulator } from "./simulator";
import { IMeasurement } from "../server/measurement";
import { Garni1025ArcusSimulator } from "./garni1025ArcusSimulator";
import StationGarni1025Arcus from "../server/stationGarni1025Arcus";
import { DomSimulator } from "./domSimulator";
import { Dom } from "../server/dom";
import { CController } from "../common/controller";

async function main(
  station: IStation,
  simulator: CSimulator,
  meas: IMeasurement,
) {
  const data1 = simulator.generateData(new Date(), station.passkey);
  const data2 = simulator.generateOffsetData(data1, 5);
  const data3 = simulator.generateOffsetData(data1, -5);
  console.info(data1);
  console.info(data2);
  console.info(data3);
  // console.log(decodedData1);

  const d = new Date();
  d.setUTCMilliseconds(0);
  const pgtime = `${d.getUTCFullYear()}-${
    d.getUTCMonth() + 1
  }-${d.getUTCDate()} ${d.getUTCHours()}:${d.getUTCMinutes()}`;

  const toMinute = Date.now() % 60000;

  data1.dateutc = `${pgtime}:${d.getUTCSeconds()}`;
  data2.dateutc = `${pgtime}:${d.getUTCSeconds() + 1}`;
  data3.dateutc = `${pgtime}:${d.getUTCSeconds() + 2}`;

  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data1.dateutc, pgtime);
  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data2.dateutc, pgtime);
  console.info("Now, Timestamp, Redis, pgtime, Pg", d, data3.dateutc, pgtime);

  let { decoded } = meas.decodeData(data1);
  const pgData = simulator.getPGData(decoded);
  const cCtrl = new CController(null, true); // todo
  cCtrl.setStation(station);
  const datas = [data1, data2, data3];

  for (const data of datas) {
    // eslint-disable-next-line no-await-in-loop
    await simulator.postData(data);
    // eslint-disable-next-line no-await-in-loop
    const sd = await simulator.fetchStationData(station.id);
    decoded = meas.decodeData(data).decoded;
    simulator.correctTimestamp(decoded, sd);
    assert.deepStrictEqual(sd, decoded);
    console.info("Redis OK", station.id);
    // eslint-disable-next-line no-await-in-loop
    await cCtrl.fetchData();
    assert.deepStrictEqual(
      simulator.getClientStationData(
        station.id === "dom" ? cCtrl.domData.data : cCtrl.stationData.data,
      ),
      decoded,
    );
    console.info("Client OK", station.id);
  }

  setTimeout(async () => {
    const rows = await simulator.loadStationData(pgtime, station.id);
    simulator.correctTimestamp(pgData, rows);
    assert.deepStrictEqual(rows, pgData);
    console.info("PG OK", station.id);
  }, 67000 - toMinute);
}

const allStationsCfg = new AllStationsCfg();
allStationsCfg.readCfg().then(async () => {
  //  const simulator = new GoGenMe3900Simulator();
  //  const meas = new StationGoGenMe3900(station.id);
  let STATION_ID = allStationsCfg.getSecondDefaultStationID(); // todo
  let station = allStationsCfg.getStationByID(STATION_ID);
  let simulator: CSimulator = new Garni1025ArcusSimulator();
  let meas: IMeasurement = new StationGarni1025Arcus(station.id);
  await main(station, simulator, meas);

  STATION_ID = allStationsCfg.getDefaultStationID(); // todo
  station = allStationsCfg.getStationByID(STATION_ID);
  simulator = new GoGenMe3900Simulator();
  meas = new StationGoGenMe3900(station.id);
  await main(station, simulator, meas);

  station = allStationsCfg.getStationByID("dom");
  simulator = new DomSimulator();
  meas = new Dom();
  await main(station, simulator, meas);
  // exit();
});
