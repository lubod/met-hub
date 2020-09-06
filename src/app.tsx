import React from 'react';
import WindRose from './modules/wind-rose/wind-rose';
import { Station } from './modules/station/station';
import './style.scss';
import { Row } from 'reactstrap';
import { Dom } from './modules/dom/dom';

export class App extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <div className='row'>
        <div className='col-4'>
          <Station />
        </div>
        <div className='col-4'>
          <Dom />
        </div>
      </div>
    );
  }
}
