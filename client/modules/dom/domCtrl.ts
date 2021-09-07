import { DomData } from './domData';

export class DomCtrl {
    domData: DomData;

    constructor(mySocket: any, domData: DomData) {
        this.domData = domData;
        this.fetchData();
        this.fetchTrendData();
        mySocket.getSocket().on('dom', domData.processData);
        mySocket.getSocket().on('domTrend', domData.processTrendData);
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
