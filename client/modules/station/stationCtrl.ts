import { StationData } from './stationData';

export class StationCtrl {
    stationData: StationData;

    constructor(mySocket: any, stationData: StationData) {
        this.stationData = stationData;
        this.fetchData();
        this.fetchTrendData();
        mySocket.getSocket().on('station', stationData.processData);
        mySocket.getSocket().on('stationTrend', stationData.processTrendData);
        //props.socket.getSocket().emit('station', 'getLastData');
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
