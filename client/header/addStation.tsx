/* eslint-disable no-param-reassign */
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Row, Col, Modal, Button, Form, Stack } from "react-bootstrap";
import { AppContext } from "..";
import { MyModalContainer } from "../misc/mycontainer";

type Props = {
  appContext: AppContext;
};

const AddStation = observer(({ appContext }: Props) => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [place, setPlace] = useState("");
  const [type, setType] = useState("GoGen Me 3900");
  const [error, setError] = useState("");
  const [step2, setStep2] = useState(false);
  const [id, setId] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    const res = await appContext.headerCtrl.addStation({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      type,
      place,
      passkey: null,
      id: null,
      measurement: null,
      public: true,
      owner: null,
    });
    setError(res.err);
    if (res.id !== "") {
      console.info(res.id);
      setStep2(true);
      setId(res.id);
    }
  }
  // console.info("Header render");

  return (
    <Modal
      fullscreen
      show={appContext.headerCtrl.headerData.showModal}
      onHide={() => appContext.headerCtrl.headerData.setShowModal(false)}
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title id="contained-modal-title-lg">Add new station</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <Stack direction="horizontal" className="mb-3" gap={3}>
          <div className="">Step 1:</div>
          <div className="text-danger">{error}</div>
        </Stack>
        <MyModalContainer>
          <Form>
            <Row className="align-items-center">
              <Col>
                <Form.Group className="mb-3" controlId="formLat">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    placeholder="12.3456"
                    onChange={(e) => setLat(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formLon">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    placeholder="12.3456"
                    onChange={(e) => setLon(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col>
                <Form.Group className="mb-3" controlId="formPlace">
                  <Form.Label>Place</Form.Label>
                  <Form.Control
                    placeholder="Marianka"
                    onChange={(e) => setPlace(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formType">
                  <Form.Label>Type</Form.Label>
                  <Form.Select aria-label="Default select example">
                    <option value="GoGen Me 3900">GoGen Me 3900</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button variant="secondary" type="submit">
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button variant="primary" onClick={(e) => submit(e)}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </MyModalContainer>
        {step2 && (
          <>
            <Stack direction="horizontal" className="m-3" gap={3}>
              <div className="">Step 2:</div>
              <div className="text-danger">{error}</div>
            </Stack>
            <MyModalContainer>
              <Row>
                <Col>
                  <ol className="text-start">
                    <div>New station was created with station_id={id}</div>
                    <div>
                      Follow these steps to configure data upload from your
                      station to www.met-hub.com according to the picture:
                    </div>
                    <li>Open WS View application on your phone/tablet</li>
                    <li>Choose your device</li>
                    <li>Go to customized data upload</li>
                    <li>Customized: Enable</li>
                    <li>Protocol type same as: Ecowitt</li>
                    <li>Server IP / Hostname: www.met-hub.com</li>
                    <li>Path: /setData/{id}</li>
                    <li>Port: 80</li>
                    <li>Upload interval: 16 Seconds</li>
                    <li>Save & Finish</li>
                    <li>Click Done button bellow</li>
                  </ol>
                  <Form>
                    <Button variant="primary" type="submit">
                      Done
                    </Button>
                  </Form>
                </Col>
                <Col>
                  <img src="station-setup.jpg" alt="" width={250} />
                </Col>
              </Row>
            </MyModalContainer>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-dark text-white" />
    </Modal>
  );
});

export default AddStation;
