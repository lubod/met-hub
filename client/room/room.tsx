import React, { useState } from 'react';
import Data from '../data/data';
import Text from '../text/text';
import { Row, Col } from 'react-bootstrap';
import Trend from '../trend/trend';

type RoomProps = {
    air: number,
    floor: number,
    required: number,
    heat: number,
    summer: number,
    low: number,
    room: string,
    airTrend: Array<number>,
    floorTrend: Array<number>
}

function Room(props: RoomProps) {
    return (
        <div className='text-left small text-info font-weight-bold'>{props.room}
            <Row className='text-light'>
                <Col xs={3}>
                    <Data name='' value={props.air} unit='°C' fix={1}></Data>
                    <Trend data={props.airTrend} range={1.5}></Trend>
                </Col>
                <Col xs={3}>
                    <Data name='' value={props.floor} unit='°C' fix={1}></Data>
                    <Trend data={props.floorTrend} range={1.5}></Trend>
                </Col>
                <Col xs={3}>
                    <Data name='' value={props.required} unit='°C' fix={1}></Data>
                </Col>
                <Col xs={2}>
                    <Text name='' value={'' + (props.heat != null ? props.heat.toFixed(0) : '') + (props.summer != null? props.summer.toFixed(0) : '') + (props.low != null ? props.low.toFixed(0) : '')} ></Text>
                </Col>
            </Row>
        </div>
    );
};

export default Room;