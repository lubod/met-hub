import { observer } from 'mobx-react';
import React, { useState } from 'react';

type DataProps = {
    name: string,
    value: string
}

const Text = observer((props: DataProps) => {
    return (
        <div className='text-left'>
            <div className='small text-info font-weight-bold'>{props.name}</div>
            <span className='h4 mr-1'>{props.value == null ? '-' : props.value}</span>
        </div>
    );
});

export default Text;