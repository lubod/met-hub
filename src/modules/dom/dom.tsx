import React from 'react';
import Data from '../data/data';
import Room from '../room/room';
import { DomModel } from '../../models/model';
import { observer } from 'mobx-react';
import { DomController } from '../../controllers/dom-controller';
import './style.scss';

@observer
export class Dom extends React.Component<{}, {}> {
  private model = new DomModel();
  private controller = new DomController(this.model);

  handleClick() {
    window.location.href = "grafana.html";
  }

  public render(): JSX.Element {
    return (
      <div className='main'>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Place' value={this.model.domData.place} unit='' ></Data>
            </div>
            <div className='col-6 text-left'>
              <button onClick={this.handleClick} type='button' id='history' className='btn btn-secondary'>Grafana: History</button>
            </div>
          </div>
          <div className='row'>
            <div className='col-6 text-right'>
              <Data name='Date' value={this.model.domData.date} unit='' ></Data>
            </div>
            <div className='col-6 text-left'>
              <Data name='Time' value={this.model.domData.time} unit='' ></Data>
            </div>
          </div>
        </div>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <div className='text-center'>OUT</div>
          <div className='row'>
            <div className='col-4 text-left'>
              <Data name='Temperature' value={this.model.domData.temp} unit='°C' ></Data>
            </div>
            <div className='col-4 text-left'>
              <Data name='Humidity' value={this.model.domData.humidity} unit='%' ></Data>
            </div>
            <div className='col-4 text-left'>
              <Data name='Rain' value={this.model.domData.rain} unit='' ></Data>
            </div>
          </div>
        </div>
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
          <Room room='Living room' air={this.model.domData.obyvacka_vzduch} floor={this.model.domData.obyvacka_podlaha} required={this.model.domData.obyvacka_req} heat={this.model.domData.obyvacka_kuri} summer={this.model.domData.obyvacka_leto} low={this.model.domData.obyvacka_low} />
          <Room room='Guest room' air={this.model.domData.pracovna_vzduch} floor={this.model.domData.pracovna_podlaha} required={this.model.domData.pracovna_req} heat={this.model.domData.pracovna_kuri} summer={this.model.domData.pracovna_leto} low={this.model.domData.pracovna_low} />
          <Room room='Bed room' air={this.model.domData.spalna_vzduch} floor={this.model.domData.spalna_podlaha} required={this.model.domData.spalna_req} heat={this.model.domData.spalna_kuri} summer={this.model.domData.spalna_leto} low={this.model.domData.spalna_low} />
          <Room room='Boys' air={this.model.domData.chalani_vzduch} floor={this.model.domData.chalani_podlaha} required={this.model.domData.chalani_req} heat={this.model.domData.chalani_kuri} summer={this.model.domData.chalani_leto} low={this.model.domData.chalani_low} />
          <Room room='Petra' air={this.model.domData.petra_vzduch} floor={this.model.domData.petra_podlaha} required={this.model.domData.petra_req} heat={this.model.domData.petra_kuri} summer={this.model.domData.petra_leto} low={this.model.domData.petra_low} />
        </div>
      </div >
    );
  }
}
