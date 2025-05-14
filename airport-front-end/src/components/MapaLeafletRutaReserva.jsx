import React, { useState, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Polyline } from "react-leaflet";
import plano from '/src/components/assets/planol.png';
import L from "leaflet";

const imageWidth = 1027;
const imageHeight = 664;
const bounds = [[0, 0], [imageHeight, imageWidth]];
const baseY = imageHeight / 2;
const baseX = imageWidth / 2;

const normalizeCoordinates = ([x, y]) => [y * imageHeight, x * imageWidth];

const IndoorMap = ({ startLocation, endLocation }) => {
  const [route, setRoute] = useState([]); // Ruta devuelta por la API

  useEffect(() => {
    if (startLocation && endLocation) {
      fetch("http://127.0.0.1:8000/api/shortest-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: startLocation,
          goal: endLocation,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.path) {
            setRoute(data.path.map(normalizeCoordinates)); // Normalizar puntos a formato Leaflet
          }
        })
        .catch((error) => console.error("Error fetching route:", error));
    }
  }, [startLocation, endLocation]);

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds} // Ajustar los límites al tamaño de la imagen
      center={[baseY, baseX]} // Centrar el mapa
      zoom={-1}
      style={{ height: "100%", width: "100%" }}
      minZoom={-1}
    >
      <ImageOverlay url={plano} bounds={bounds} />

      {/* Mostrar puntos seleccionados */}
      {startLocation && <Marker position={normalizeCoordinates(startLocation)} />}
      {endLocation && <Marker position={normalizeCoordinates(endLocation)} />}

      {/* Dibujar la ruta */}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
};

export default IndoorMap;