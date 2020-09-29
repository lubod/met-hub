import React, { useState } from 'react';
import './style.scss';

type DataProps = {
    name: string,
    value: string
}

function Text(props: DataProps) {
    return (
        <div className='text-left'>
            <div className='small text-info'>{props.name}</div>
            <span className='h4 mr-1'>{props.value}</span>
        </div>
    );
};

export default Text;