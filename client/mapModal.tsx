import React from "react";
import { Modal } from "react-bootstrap";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type MapModalProps = {
  modalShow: boolean;
  handleClose: any;
};

const MapModal = function ({
  modalShow,
  handleClose,
}: // range
MapModalProps) {
  // console.info("render modal");
  return (
    <Modal
      show={modalShow}
      onHide={handleClose}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MapContainer center={[48.2482, 17.0589]} zoom={13} scrollWheelZoom>
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
      </Modal.Body>

      <Modal.Footer />
    </Modal>
  );
};

export default MapModal;
