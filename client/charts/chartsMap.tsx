import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { AppContext } from "..";

type Props = {
  appContext: AppContext;
};

function MapResizer({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView([lat, lon], map.getZoom());
    const timer = setTimeout(() => {
      map.invalidateSize();
      map.setView([lat, lon], map.getZoom());
    }, 200);
    return () => clearTimeout(timer);
  }, [map, lat, lon]);
  return null;
}

const ChartsMap = observer(({ appContext }: Props) => {
  console.info("render map", appContext.chartsCtrl.chartsData.station);
  const { lat, lon } = appContext.chartsCtrl.chartsData.station;

  return (
    <div id="map" className="flex flex-col w-full h-52 lg:h-full lg:min-h-[30rem] rounded-xl overflow-hidden">
      <MapContainer
        center={[lat, lon]}
        zoom={6}
        scrollWheelZoom
        className="w-full h-52 lg:h-full lg:min-h-[30rem]"
        style={{
          filter:
            "brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7) opacity(0.9)",
        }}
      >
        <MapResizer lat={lat} lon={lon} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[lat, lon]}
        >
          <Popup>
            {lat}, {lon}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
});

export default ChartsMap;
