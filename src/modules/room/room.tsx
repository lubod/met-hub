import React, { useState } from 'react';
import Data from '../data/data';
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
        <div className='container text-center bg-dark text-light my-2 py-2 mx-auto'>
            <div className='text-center'>{props.room}</div>
            <div className='row'>
                <div className='col-4 text-left'>
                    <Data name='Air' value={props.air} unit='°C' ></Data>
                </div>
                <div className='col-4 text-left'>
                    <Data name='Floor' value={props.floor} unit='°C' ></Data>
                </div>
                <div className='col-4 text-left'>
                    <Data name='Required' value={props.required} unit='°C' ></Data>
                </div>
            </div>
            <div className='row'>
                <div className='col-4 text-left'>
                    <Data name='Heat' value={props.heat} unit='' ></Data>
                </div>
                <div className='col-4 text-left'>
                    <Data name='Summer' value={props.summer} unit='' ></Data>
                </div>
                <div className='col-4 text-left'>
                    <Data name='Low' value={props.low} unit='' ></Data>
                </div>
            </div>
        </div >
    );
};

export default Room;