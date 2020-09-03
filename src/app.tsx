import React from 'react';
import WindRose from './modules/wind-rose/wind-rose';
import Data from './modules/data/data';
import { Model } from './models/model';
import './style.scss';
import { observer } from 'mobx-react';
import { AppController } from './controllers/app-controller';

@observer
export class App extends React.Component<{}, {}> {
  private model = new Model();
  private controller = new AppController(this.model);

  public render(): JSX.Element {
    return (
      <div>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <a href='grafana.html'>Grafana</a>
          <Data name='Place' value={this.model.stationData.place} unit='' ></Data>
          <Data name='Timestamp' value={this.model.stationData.timestamp} unit='' ></Data>
        </div>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <WindRose speed={this.model.stationData.windspeed} dir={this.model.stationData.winddir}></WindRose>
        </div>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <Data name='Temperature IN' value={this.model.stationData.tempin} unit='°C' ></Data>
          <Data name='Humidity IN' value={this.model.stationData.humidityin} unit='%' ></Data>
          <Data name='Temperature' value={this.model.stationData.temp} unit='°C' ></Data>
          <Data name='Humidity' value={this.model.stationData.humidity} unit='%' ></Data>
          <Data name='Relative Pressure' value={this.model.stationData.pressurerel} unit='hPa' ></Data>
          <Data name='Wind Gust' value={this.model.stationData.windgust} unit='km/h' ></Data>
          <Data name='Max Daily Gust' value={this.model.stationData.maxdailygust} unit='km/h' ></Data>
          <Data name='Solar Radiation' value={this.model.stationData.solarradiation} unit='W/m2' ></Data>
          <Data name='UV' value={this.model.stationData.uv} unit='' ></Data>
          <Data name='Rain Rate' value={this.model.stationData.rainrate} unit='mm/h' ></Data>
          <Data name='Event Rain' value={this.model.stationData.eventrain} unit='mm' ></Data>
          <Data name='Hourly Rain' value={this.model.stationData.hourlyrain} unit='mm' ></Data>
          <Data name='Daily Rain' value={this.model.stationData.dailyrain} unit='mm' ></Data>
          <Data name='Weekly Rain' value={this.model.stationData.weeklyrain} unit='mm' ></Data>
          <Data name='Monthly Rain' value={this.model.stationData.monthlyrain} unit='mm' ></Data>
          <Data name='Total Rain' value={this.model.stationData.totalrain} unit='mm' ></Data>
        </div>
      </div>
    );
  }
}
