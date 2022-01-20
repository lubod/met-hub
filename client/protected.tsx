import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import Iframe from "react-iframe";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Dom from "./dom/dom";
import Station from "./station/station";
import "./style.scss";
import { AppContextP } from ".";

const Protected = function () {
  console.info("Protected render");
  const [valueStation, setValueStation] = useState("current");
  const handleChangeStation = (val: any) => setValueStation(val);

  const [valueDom, setValueDom] = useState("current");
  const handleChangeDom = (val: any) => setValueDom(val);

  const appContext = useContext(AppContextP);

  return (
    <Container className="container-max-width text-center py-2">
      <Row>
        <Col sm={6} className="px-2">
          <ToggleButtonGroup
            className="btn-block"
            type="radio"
            name="stationOptions"
            defaultValue="current"
            onChange={handleChangeStation}
          >
            <ToggleButton id="stb1" value="current">
              Current
            </ToggleButton>
            <ToggleButton id="stb2" value="history">
              History
            </ToggleButton>
            <ToggleButton id="stb3" value="map">
              Map
            </ToggleButton>
          </ToggleButtonGroup>
          {valueStation === "current" && <Station />}
          {valueStation === "history" && (
            <Container className="bg-very-dark mx-auto my-2 py-2">
              <Iframe
                url={`/charts/d/-LNB7_HGk/stanica?orgId=1&from=now-24h&to=now&token=${appContext.auth.getToken()}`}
                width="100%"
                height="700px"
              />
            </Container>
          )}
          {valueStation === "map" && (
            <Container className="bg-very-dark mx-auto my-2 py-2">
              <MapContainer
                center={[48.2482, 17.0589]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[48.2482, 17.0589]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              </MapContainer>
            </Container>
          )}
        </Col>
        <Col sm={6} className="px-2">
          <ToggleButtonGroup
            className="btn-block"
            type="radio"
            name="domOptions"
            defaultValue="current"
            onChange={handleChangeDom}
          >
            <ToggleButton id="dtb1" value="current">
              Current
            </ToggleButton>
            <ToggleButton id="dtb2" value="history">
              History
            </ToggleButton>
            <ToggleButton id="dtb3" value="map">
              Map
            </ToggleButton>
          </ToggleButtonGroup>
          {valueDom === "current" && <Dom />}
          {valueDom === "history" && (
            <Container className="bg-very-dark mx-auto my-2 py-2">
              <Iframe
                url={`/charts/d/80t3t_HGk/dom?orgId=1&from=now-24h&to=now&token=${appContext.auth.getToken()}`}
                width="100%"
                height="700px"
              />
            </Container>
          )}
          {valueDom === "map" && <div />}
        </Col>
      </Row>
    </Container>
  );
};

export default Protected;
