import React, { useState } from 'react';
import './style.scss';

type DataProps = {
    name: string,
    value: string,
    unit: string
}

function Data(props: DataProps) {
    return (
        <div className='text-left'>
            <div className='small text-info'>{props.name}</div>
            <span className='h4 mr-1'>{props.value}</span>
            <span className='small'>{props.unit}</span>
        </div>
    );
};

export default Data;