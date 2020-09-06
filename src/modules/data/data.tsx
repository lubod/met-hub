import React, { useState } from 'react';
import './style.scss';

type DataProps = {
    name: string,
    value: string,
    unit: string
}

function Data(props: DataProps) {
    return (
        <div>
            <span className='small'>{props.name}</span>
            <span className='ml-2 h4 text-info mr-1'>{props.value}</span>
            <span className='text-info small'>{props.unit}</span>
        </div>
    );
};

export default Data;