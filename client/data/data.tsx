import React, { useState } from 'react';

type DataProps = {
    name: string,
    value: number,
    unit: string,
    fix: number
}

function Data(props: DataProps) {
    return (
        <div className='text-left'>
            <div className='small text-info font-weight-bold'>{props.name}</div>
            <span className='h4 mr-1'>{props.value == null ? '' : props.value.toFixed(props.fix)}</span>
            <span className='small'>{props.unit}</span>
        </div>
    );
};

export default Data;