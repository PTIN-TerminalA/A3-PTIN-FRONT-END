import React, { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, Marker, Polyline } from "react-leaflet";
import plano from '/src/components/assets/planol.png';
import L from "leaflet";

const imageWidth = 3850;
const imageHeight = 2569;
const bounds = [[0, 0], [imageHeight, imageWidth]];
const baseY = imageHeight / 2;
const baseX = imageWidth / 2;

const normalizeCoordinates = ([x, y]) => [(1 - y) * imageHeight, x * imageWidth];
const normalizeCoordinatesPos = ([x, y]) => [x, (1 - y)];
const normalizeCoordinatesRuta = ([x, y]) => [y * imageHeight, x * imageWidth];
const _url = `http://localhost:8000`;

const MapaLeafletGestioReservas = ({ routes }) => {
  const [calculatedRoute, setCalculatedRoute] = useState([]);

  useEffect(() => {
    if (routes && routes.length === 1 && routes[0].start && routes[0].end) {
      const start = routes[0].start;
      const end = routes[0].end;
      fetch(`${_url}/api/shortest-path`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: normalizeCoordinatesPos(start), goal: normalizeCoordinatesPos(end)})
      })
        .then(res => res.json())
        .then(data => {
          if (data.path && Array.isArray(data.path)) {
            setCalculatedRoute(data.path);
          } else {
            setCalculatedRoute([]);
          }
        })
        .catch(() => setCalculatedRoute([]));
    } else {
      setCalculatedRoute([]);
    }
  }, [routes]);

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      center={[baseY, baseX]}
      zoom={-2.0}
      style={{ height: "100%", width: "100%" }}
      minZoom={-3}
    >
      <ImageOverlay url={plano} bounds={bounds} />
      {routes && routes.length === 1 && routes[0].start && (
        <Marker position={normalizeCoordinates(routes[0].start)} opacity={0.9} />
      )}
      {routes && routes.length === 1 && routes[0].end && (
        <Marker position={normalizeCoordinates(routes[0].end)} />
      )}
      {calculatedRoute.length > 1 && (
        <Polyline
          positions={calculatedRoute.map(normalizeCoordinatesRuta)}
          color="blue"
          weight={4}
        />
      )}
    </MapContainer>
  );
};

export default MapaLeafletGestioReservas;