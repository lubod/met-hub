import React, { useState } from 'react';
import Data from '../data/data';
import Text from '../text/text';
import { Row, Col } from 'react-bootstrap';
import './style.scss';

type RoomProps = {
    air: number,
    floor: number,
    required: number,
    heat: number,
    summer: number,
    low: number,
    room: string
}

function Room(props: RoomProps) {
    return (
        <div className='text-left small text-info'>{props.room} 
            <Row className = 'text-light'>
                <Col xs={3}>
                    <Data name='' value={props.air} unit='°C' fix={1}></Data>
                </Col>
                <Col xs={3}>
                    <Data name='' value={props.floor} unit='°C' fix={1}></Data>
                </Col>
                <Col xs={3}>
                    <Data name='' value={props.required} unit='°C' fix={1}></Data>
                </Col>
                <Col xs={2}>
                    <Text name='' value={'' + props.heat?.toFixed(0) + props.summer?.toFixed(0) + props.low?.toFixed(0)} ></Text>
                </Col>
            </Row>
        </div>
    );
};

export default Room;