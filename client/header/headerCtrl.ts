import { AppContext } from "..";
import { IStation } from "../../common/allStationsCfg";
import HeaderData from "./headerData";

export default class HeaderCtrl {
  headerData: HeaderData;

  appContext: AppContext;

  timer: any;

  constructor(appContext: AppContext) {
    this.headerData = new HeaderData();
    this.appContext = appContext;
  }

  async start() {
    this.timer = setInterval(() => {
      this.headerData.setTime(new Date());
    }, 1000);
  }

  setAllStations(allStations: Array<IStation>) {
    this.headerData.setAllStations(allStations);
  }

  setStation(station: IStation) {
    this.headerData.setStation(station);
  }
}
