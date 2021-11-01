import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { AppDataP } from '..';
import Text from '../text/text';

const Time = observer(() => {
    const app = useContext(AppDataP);
    return (
        <Container className='text-center text-light my-2 py-2 mx-auto border-primary bg-very-dark rounded shadow'>
            <Row>
                <Col xs={12}>
                    <Text name={'Current time ' + app.ctime.toLocaleTimeString('sk-SK')} value={''} ></Text>
                </Col>
            </Row>
        </Container>
    );
});

export default Time;