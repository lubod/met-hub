import HeaderData from "./headerData";

export default class HeaderCtrl {
  headerData: HeaderData;

  timer: any;

  constructor(defaultStationID: string, isExternalID: boolean) {
    this.headerData = new HeaderData(defaultStationID, isExternalID);
  }

  start() {
    this.timer = setInterval(() => {
      this.headerData.setTime(new Date());
    }, 1000);
  }
}
