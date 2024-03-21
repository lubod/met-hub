import React from "react";
import { observer } from "mobx-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { AppContext } from "..";

type Props = {
  appContext: AppContext;
};

const ChartsMap = observer(({ appContext }: Props) => {
  console.info("render map", appContext.chartsCtrl.chartsData.station);
  return (
    <div id="map" className="flex flex-col w-full h-52">
      <MapContainer
        center={[48.6776, 19.699]}
        zoom={6}
        scrollWheelZoom
        className="w-full h-52"
        style={{
          filter:
            "brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7) opacity(0.9)",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[
            appContext.chartsCtrl.chartsData.station.lat,
            appContext.chartsCtrl.chartsData.station.lon,
          ]}
        >
          <Popup>
            {appContext.chartsCtrl.chartsData.station.lat},{" "}
            {appContext.chartsCtrl.chartsData.station.lon}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
});

export default ChartsMap;
