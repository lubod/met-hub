import { DomCfg, IDomData, IDomTrendData } from '../../common/models/domModel';
import { DomData } from './domData';

export class DomCtrl {
    domData: DomData;
    domCfg: DomCfg;

    constructor(mySocket: any, domData: DomData) {
        this.domData = domData;
        this.domCfg = new DomCfg();
        this.fetchData();
        this.fetchTrendData();
        mySocket.getSocket().on(this.domCfg.SOCKET_CHANNEL, (newData: IDomData) => domData.processData(newData));
        mySocket.getSocket().on(this.domCfg.SOCKET_TREND_CHANNEL, (newTrendData: IDomTrendData) => domData.processTrendData(newTrendData));
        //props.socket.getSocket().emit('dom', 'getLastData');
    }

    async fetchData() {
        const url = '/api/getLastData/dom';
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
            this.domData.processData(newData);
        } catch (e) {
            console.error(e);
        }
    }

    async fetchTrendData() {
        const url = '/api/getTrendData/dom';
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
            this.domData.processTrendData(newData);
        } catch (e) {
            console.error(e);
        }
    }
}
