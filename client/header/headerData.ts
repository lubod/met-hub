import { action, makeObservable, observable } from "mobx";
import { IStation } from "../../common/allStationsCfg";

export default class HeaderData {
  ctime: Date = new Date();

  station: IStation = null;

  isExternalID: boolean = false;

  allStations: Array<IStation> = null;

  showModal: boolean = false;

  constructor() {
    makeObservable(this, {
      ctime: observable,
      station: observable,
      isExternalID: observable,
      allStations: observable,
      showModal: observable,
      setTime: action,
      setStation: action,
      setAllStations: action,
      setShowModal: action,
    });
  }

  setShowModal(showModal: boolean) {
    this.showModal = showModal;
  }

  setAllStations(allStations: Array<IStation>) {
    this.allStations = allStations;
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
  }

  setIsExternalID(isExternalID: boolean) {
    this.isExternalID = isExternalID;
  }

  setStation(station: IStation) {
    this.station = station;
  }
}
