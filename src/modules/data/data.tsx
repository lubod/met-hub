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
            <span className="pr-2">{props.name}</span>
            <span className="h4 text-info">{props.value}</span>
            <span className="text-info">{props.unit}</span>
        </div>
    );
};

export default Data;