import HeaderData from "./headerData";

export default class HeaderCtrl {
  headerData: HeaderData;

  timer: any;

  constructor(headerData: HeaderData) {
    this.headerData = headerData;
  }

  start() {
    this.timer = setInterval(() => {
      this.headerData.setTime(new Date());
    }, 1000);
  }
}
