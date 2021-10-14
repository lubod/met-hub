import { IStationData, IStationTrendData, StationCfg } from '../../common/models/stationModel';
import { StationData } from './stationData';

export class StationCtrl {
    stationData: StationData;
    timer: NodeJS.Timer;
    stationCfg: StationCfg;

    constructor(mySocket: any, stationData: StationData) {
        this.stationData = stationData;
        this.stationCfg = new StationCfg();
        this.fetchData();
        this.fetchTrendData();
        mySocket.getSocket().on(this.stationCfg.SOCKET_CHANNEL, (newData: IStationData) => stationData.processData(newData));
        mySocket.getSocket().on(this.stationCfg.SOCKET_TREND_CHANNEL, (newTrendData: IStationTrendData) => stationData.processTrendData(newTrendData));
        //props.socket.getSocket().emit('station', 'getLastData');
        this.timer = setInterval(() => {
            stationData.setTime(new Date());
            //stationData.setOldData(new Date());
            //console.info('timer ++');
        } , 1000);
    }

    async fetchData() {
        const url = '/api/getLastData/station';
        console.info(url);

        try {
            const response = await fetch(url, {
                headers: {
                    //Authorization: `Bearer ${props.auth.getToken()}`,
                }
            });

            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }

            const newData = await response.json();
            this.stationData.processData(newData);
        } catch (e) {
            console.error(e);
        }
    }

    async fetchTrendData() {
        const url = '/api/getTrendData/station';
        console.info(url);

        try {
            const response = await fetch(url, {
                headers: {
                    //Authorization: `Bearer ${props.auth.getToken()}`,
                }
            });

            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }

            const newData = await response.json();
            this.stationData.processTrendData(newData);
        } catch (e) {
            console.error(e);
        }
    }
}
