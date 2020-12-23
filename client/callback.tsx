import React from 'react';
import { withRouter } from 'react-router';

function Callback(props: any) {
    props.auth.handleAuthentication().then(() => {
//        console.info(props.auth.isAuthenticated());
        props.history.push('/');
    });

//    console.log('Callback');
    return (
        <div className='text-center text-info h4'>
            Authenticate ...
        </div>
    );
}

export default withRouter(Callback);
