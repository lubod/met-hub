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

  setAllStations(allStations: Array<IStation> | null) {
    this.headerData.setAllStations(allStations);
  }

  setStation(station: IStation | null) {
    this.headerData.setStation(station);
  }

  async addStation(station: IStation) {
    try {
      const url = "/api/addStation";
      console.info(url);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(station),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      return { id: data.id, err: "" };
    } catch (error: any) {
      console.error(error);
      const msg = error?.message ?? "Unknown error";
      return { id: "", err: msg };
    }
  }
}
