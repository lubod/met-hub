import GoData from "./goData";

export default class GoCtrl {
  goData: GoData;

  timer: any;

  constructor() {
    this.goData = new GoData();
  }

  start() {
    //   this.timer = setInterval(() => {
    //     this.headerData.setTime(new Date());
    //   }, 1000);
  }
}
