import React from 'react';
import WindRose from '../wind-rose/wind-rose';
import Data from '../data/data';
import { StationModel } from '../../models/model';
import { observer } from 'mobx-react';
import { StationController } from '../../controllers/station-controller';
import './style.scss';

@observer
export class Station extends React.Component<{}, {}> {
  private model = new StationModel();
  private controller = new StationController(this.model);

  handleClick() {
    window.location.href = "grafana.html";
  }

  public render(): JSX.Element {
    return (
      <div className='main'>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Place' value={this.model.stationData.place} unit='' ></Data>
            </div>
            <div className='col-6 text-left'>
              <button onClick={this.handleClick} type='button' id='history' className='btn btn-secondary'>Grafana: History</button>
            </div>
          </div>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Date' value={this.model.stationData.date} unit='' ></Data>
            </div>
            <div className='col-6 text-left'>
              <Data name='Time' value={this.model.stationData.time} unit='' ></Data>
            </div>
          </div>
        </div>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <WindRose speed={this.model.stationData.windspeed} dir={this.model.stationData.winddir} gust={this.model.stationData.windgust} dailyGust={this.model.stationData.maxdailygust}></WindRose>
        </div>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Temperature' value={this.model.stationData.temp} unit='°C' ></Data>
            </div>
            <div className='col-6 text-left'>
              <Data name='Humidity' value={this.model.stationData.humidity} unit='%' ></Data>
            </div>
          </div>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Radiation' value={this.model.stationData.solarradiation} unit='W/m2' ></Data>
            </div>
            <div className='col-6 text-left'>
              <Data name='UV' value={this.model.stationData.uv} unit='' ></Data>
            </div>
          </div>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Pressure' value={this.model.stationData.pressurerel} unit='hPa' ></Data>
            </div>
            <div className='col-6 text-left'>
            </div>
          </div>
          <div className='row'>
            <div className='col-6 text-right'>
            </div>
            <div className='col-6 text-left'>
              <Data name='Rain Rate' value={this.model.stationData.rainrate} unit='mm/h' ></Data>
            </div>
          </div>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Event Rain' value={this.model.stationData.eventrain} unit='mm' ></Data>
            </div>
            <div className='col-6 text-left'>
              <Data name='Hourly Rain' value={this.model.stationData.hourlyrain} unit='mm' ></Data>
            </div>
          </div>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Daily' value={this.model.stationData.dailyrain} unit='mm' ></Data>
            </div>
            <div className='col-6 text-left'>
              <Data name='Weekly' value={this.model.stationData.weeklyrain} unit='mm' ></Data>
            </div>
          </div>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Monthly' value={this.model.stationData.monthlyrain} unit='mm' ></Data>
            </div>
            <div className='col-6 text-left'>
              <Data name='Total' value={this.model.stationData.totalrain} unit='mm' ></Data>
            </div>
          </div>
        </div>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <div className='text-center'>IN</div>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Temperature' value={this.model.stationData.tempin} unit='°C' ></Data>
            </div>
            <div className='col-6 text-left'>
              <Data name='Humidity' value={this.model.stationData.humidityin} unit='%' ></Data>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
