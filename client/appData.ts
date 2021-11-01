import { makeObservable, observable } from 'mobx';

export class AppData {
    ctime: Date = new Date();
    timer: NodeJS.Timer;

    constructor() {
        makeObservable(this, {
            ctime: observable,
        });

        this.timer = setInterval(() => {
            this.setTime(new Date());
        } , 1000);
    }

    setTime(newTime: Date) {
        this.ctime = newTime;
    }
}
