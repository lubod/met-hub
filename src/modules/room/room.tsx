import React, { useState } from 'react';
import Data from '../data/data';
import { Row, Col } from 'react-bootstrap';
import './style.scss';

type RoomProps = {
    air: string,
    floor: string,
    required: string,
    heat: string,
    summer: string,
    low: string,
    room: string
}

function Room(props: RoomProps) {
    return (
        <div className='text-left small text-info'>{props.room} 
            <Row className = 'text-light'>
                <Col xs={3}>
                    <Data name='' value={props.air} unit='°C' ></Data>
                </Col>
                <Col xs={3}>
                    <Data name='' value={props.floor} unit='°C' ></Data>
                </Col>
                <Col xs={3}>
                    <Data name='' value={props.required} unit='°C' ></Data>
                </Col>
                <Col xs={2}>
                    <Data name='' value={props.heat + props.summer + props.low} unit='' ></Data>
                </Col>
            </Row>
        </div>
    );
};

export default Room;