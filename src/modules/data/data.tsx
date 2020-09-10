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
            <div className='small'>{props.name}</div>
            <span className='h4 text-info mr-1'>{props.value}</span>
            <span className='text-info small'>{props.unit}</span>
        </div>
    );
};

export default Data;