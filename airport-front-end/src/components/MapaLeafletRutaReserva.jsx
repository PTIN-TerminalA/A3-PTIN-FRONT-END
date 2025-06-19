import React, { useState, useEffect } from "react";
import { MapContainer, ImageOverlay, Marker, Polyline } from "react-leaflet";
import plano from '/src/components/assets/planol.png';
import L from "leaflet";

const _url = 'https://flysy.software';
const imageWidth = 3850;
const imageHeight = 2569;
const bounds = [[0, 0], [imageHeight, imageWidth]];
const baseY = imageHeight / 2;
const baseX = imageWidth / 2;

const normalizeCoordinates = ([x, y]) => [(1 - y) * imageHeight, x * imageWidth];
const normalizeCoordinatesRuta = ([x, y]) => [y * imageHeight, x * imageWidth];
const normalizeCoordinatesPos = ([x, y]) => [x, (1-y)];
//const normalizeCoordinatesRuta = ([x,y]) => [(1-y) * imageHeight, x * imageWidth];

const IndoorMap = ({ startLocation, endLocation }) => {
  const [route, setRoute] = useState([]); // Ruta devuelta por la API
  const [routeTime, setRouteTime] = useState(""); // Tiempo de la ruta

  useEffect(() => {
    if (startLocation && endLocation) {
      fetch(`${_url}/api/shortest-path`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: normalizeCoordinatesPos(startLocation),
          //start: [0.0, 0.0], // Coordenadas de inicio (placeholder)
          //goal: [1.0,1.0]
          goal: normalizeCoordinatesPos(endLocation),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.path) {
            setRoute(data.path.map(normalizeCoordinatesRuta)); // Normalizar puntos a formato Leaflet
          }
          if (data.temps) {
            setRouteTime(data.temps); // Guardar el tiempo de la ruta
          }
        })
        .catch((error) => console.error("Error fetching route:", error));
    }
  }, [startLocation, endLocation]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {routeTime && (
          <div style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            left: "3.0rem",
            background: "rgba(0, 123, 255, 0.9)",
            color: "#fff",
            padding: "0.8rem 1.2rem",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            maxWidth: "fit-content", // Limitar el ancho para pantallas pequeñas
            wordWrap: "break-word", // Ajustar texto largo
          }}>
            🕒 Temps estimat: {routeTime}
          </div>
        )}
        <MapContainer
          crs={L.CRS.Simple}
          bounds={bounds} // Ajustar los límites al tamaño de la imagen
        center={[baseY, baseX]} // Centrar el mapa
        zoom={-2.0}
        zoomSnap={-0.1}
        zoomDelta={0.5}
        style={{ height: "100%", width: "100%" }}
        minZoom={-3} // Permitir más zoom out
      >
        <ImageOverlay url={plano} bounds={bounds} />

        {/* Mostrar puntos seleccionados */}
        {startLocation && <Marker position={normalizeCoordinates(startLocation)} opacity={0.9} />}
        {endLocation && <Marker position={normalizeCoordinates(endLocation)} />}

        {/* Dibujar la ruta */}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default IndoorMap;
