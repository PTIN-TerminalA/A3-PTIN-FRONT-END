import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import plano from '/src/components/assets/planol.png';

const imageWidth = 995;
const imageHeight = 630;
const bounds = [[0, 0], [imageHeight, imageWidth]];
const NUM_CARS = 10;
const NUM_USERS = 5;
const baseY = imageHeight / 2;
const baseX = imageWidth / 2;
const offsetY = 100;
const offsetX = 150;

// Icono cuadrado para coches
const customCarIcon = (color = 'red') =>
  L.divIcon({
    className: 'custom-car-marker',
    html: `<div style="
      width: 20px;
      height: 20px;
      background-color: ${color};
      border: 1px solid white;
      border-radius: 2px;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

// Icono redondo y brillante para usuarios
const customUserIcon = () =>
  L.divIcon({
    className: 'custom-user-marker',
    html: `<div style="
      width: 25px;
      height: 25px;
      background-color: yellow;
      border: 2px solid black;
      border-radius: 50%;
    "></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });

const getColorByType = (type) => {
  switch (type) {
    case 'tienda': return 'blue';
    case 'puerta': return 'green';
    case 'baño': return 'orange';
    case 'parking': return 'gray';
    default: return 'purple';
  }
};


// Zonas con Polygon
const zones = [
  {
    name: 'Sortida 5',
    type: 'Sortida',
    positions: [
      [234, 933],
      [234, 982],
      [275, 982],
      [275, 933]
    ],	
    info: 'Sortida numero 5'
  },
  {
    name: 'Lindt',
    type: 'Lindt',
    positions: [
      [358, 883],
      [358, 982],
      [276, 982],
      [276, 883]
    ],	
    info: 'Venta de bombons'
  },
  {
    name: 'Facturació est',
    type: 'Facturació',
    positions: [
      [359, 883],
      [359, 982],
      [441, 982],
      [441, 883]
    ],	
    info: 'Zona de facturació de maletes'
  },
  {
    name: 'Gate A2',
    type: 'Gate A2',
    positions: [
      [626, 883],
      [626, 982],
      [442, 982],
      [442, 883]
    ],	
    info: 'Porta embarcament A2'
  },
  {
    name: 'Seguretat nord',
    type: 'Seguretat nord',
    positions: [
      [626, 880],
      [626, 793],
      [565, 793],
      [565, 880]
    ],
    info: 'Control de seguretat de la secció nord'
  },
  {
    name: 'Levis',
    type: 'Levis',
    positions: [
      [624, 656],
      [624, 788],
      [565, 788],
      [565, 754],
      [549, 754],
      [549, 656]
    ],
    info: 'Venta de roba'
  },
  {
    name: 'Farmàcia nord',
    type: 'Farmàcia',
    positions: [
      [624, 654],
      [624, 590],
      [549, 590],
      [549, 654]
    ],
    info: 'Venta de medicaments'
  },
  {
    name: 'Chanel',
    type: 'Chanel',
    positions: [
      [624, 509],
      [624, 588],
      [549, 588],
      [549, 509]
    ],
    info: 'Venta articles alta gama'
  },
  {
    name: 'Serveis nord',
    type: 'Serveis',
    positions: [
      [624, 507],
      [624, 463],
      [549, 463],
      [549, 507]
    ],
    info: 'Serveis de la secció nord'
  },
  {
    name: 'Starbucks',
    type: 'Starbucks',
    positions: [
      [624, 328],
      [624, 461],
      [549, 461],
      [549, 328]
    ],
    info: 'Cafes i snacks'
  },
  {
    name: 'Haribo',
    type: 'Haribo',
    positions: [
      [624, 232],
      [624, 326],
      [549, 326],
      [549, 232],
    ],
    info: 'Venta de gominoles'
  },
  {
    name: 'Seguretat nord',
    type: 'Seguretat nord',
    positions: [
      [624, 98],
      [624, 230],
      [564, 230],
      [564, 98]
    ],
    info: 'Control de seguretat de la zona nord'
  },
  {
    name: 'Gate A1',
    type: 'Gate A1',
    positions: [
      [624, 7],
      [624, 97],
      [503, 97],
      [503, 7]
    ],	
    info: 'Porta embarcament A1'
  },
  {
    name: 'Facturació oest',
    type: 'Facturació',
    positions: [
      [439, 7],
      [439, 66],
      [501, 66],
      [501, 7]
    ],	
    info: 'Zona de facturació de maletes'
  },
  {
    name: 'Caixer 1',
    type: 'Caixer',
    positions: [
      [439, 97],
      [439, 67],
      [501, 67],
      [501, 97]
    ],	
    info: 'Caixer ATM'
  },
  {
    name: 'Sortida 1',
    type: 'Sortida',
    positions: [
      [439, 40],
      [439, 7],
      [410, 7],
      [410, 40]
    ],	
    info: 'Sortida numero 1'
  },
  {
    name: 'Punt informacio oest',
    type: 'Informacio',
    positions: [
      [295, 64],
      [295, 7],
      [410, 7],
      [410, 64]
    ],	
    info: 'Punt informació aeroport'
  },
  {
    name: 'Venta billets',
    type: 'Venta bitllets',
    positions: [
      [409, 65],
      [409, 103],
      [377, 103],
      [377, 65]
    ],
    info: 'Venta de bitllets avio'
  },
  {
    name: 'Parking',
    type: 'Parking',
    positions: [
      [409, 104],
      [409, 196],
      [197, 196],
      [197, 78],
      [187, 78],
      [187, 6],
      [294, 6],
      [294, 65],
      [376, 65],
      [376, 104]
    ],
    info: 'Parking de la planta 0'
  },
  {
    name: 'Escales accés 1',
    type: 'Escales accés',
    positions: [
      [543, 129],
      [543, 200],
      [500, 200],
      [500, 129]
    ],
    info: 'Escales accés 1'
  },
  {
    name: 'Serveis nord-oest',
    type: 'Serveis',
    positions: [
      [439, 129],
      [439, 201],
      [498, 201],
      [498, 129]
    ],
    info: 'Serveis de la secció nord-oest'
  },
  {
    name: 'Serveis nord-est',
    type: 'Serveis',
    positions: [
      [492, 855],
      [492, 790],
      [438, 790],
      [438, 855]
    ],
    info: 'Serveis de la secció nord-est'
  },
  {
    name: 'Escales accés 2',
    type: 'Escales accés',
    positions: [
      [494, 855],
      [494, 790],
      [535, 790],
      [535, 855]
    ],
    info: 'Escales accés 2'
  },
  {
    name: 'Oficina policial',
    type: 'Oficina policial',
    positions: [
      [520, 655],
      [520, 753],
      [444, 753],
      [444, 655]
    ],
    info: 'Oficina de la policia'
  },
  {
    name: 'Massimo Dutti',
    type: 'Tenda',
    positions: [
      [520, 653],
      [520, 508],
      [444, 508],
      [444, 653]
    ],
    info: 'Tenda de roba'
  },
  {
    name: 'Coffee house',
    type: 'Menjar',
    positions: [
      [520, 393],
      [520, 463],
      [444, 463],
      [444, 393]
    ],
    info: 'Cafés i pastes'
  },
  {
    name: 'Nike',
    type: 'Tenda',
    positions: [
      [520, 392],
      [520, 328],
      [444, 328],
      [444, 392]
    ],
    info: 'Tenda articles esportius'
  },
  {
    name: 'Sephora',
    type: 'Tenda',
    positions: [
      [520, 233],
      [520, 326],
      [444, 326],
      [444, 233]
    ],
    info: 'Tenda cosmetics i perfums'
  },
  {
    name: 'Sephora',
    type: 'Tenda',
    positions: [
      [520, 233],
      [520, 326],
      [444, 326],
      [444, 233]
    ],
    info: 'Tenda cosmetics i perfums'
  },
  {
    name: 'Escales accés 3',
    type: 'Escales accés',
    positions: [
      [320, 252],
      [320, 297],
      [246, 297],
      [246, 252]
    ],
    info: 'Escales accés 3'
  },
  {
    name: 'Parking soterrani busos i taxis',
    type: 'Parking',
    positions: [
      [321, 251],
      [415, 227],
      [321, 298],
    ],
    info: 'Parking accedit a traves de: Escales accés 3'
  },
  {
    name: 'Parking soterrani busos i taxis ',
    type: 'Parking',
    positions: [
      [321, 251],
      [415, 227],
      [415, 456],
      [210, 456],
      [210, 227],
      [415, 227],
      [321, 298],
      [245, 298],
      [245, 251]
    ],
    info: 'Parking accedit a traves de: Escales accés 3'
  },
  {
    name: 'McDonalds',
    type: 'Menjar',
    positions: [
      [416, 515],
      [416, 786],
      [257, 786],
      [257, 704],
      [368, 704],
      [368, 515]
    ],
    info: 'Restaurant de menjar ràpid'
  },
  {
    name: 'Sala actes',
    type: 'Sala actes',
    positions: [
      [366, 515],
      [366, 702],
      [257, 702],
      [257, 515]
    ],
    info: 'Sala per actes varis'
  },
  {
    name: 'Escales accés 4',
    type: 'Escales accés',
    positions: [
      [195, 512],
      [195, 568],
      [254, 568],
      [254, 512]
    ],
    info: 'Escales accés 4'
  },
  {
    name: 'Tous',
    type: 'Tendes',
    positions: [
      [254, 571],
      [254, 619],
      [181, 619],
      [181, 596],
      [149, 596],
      [149, 511],
      [193, 511],
      [193, 571]
    ],
    info: 'Tenda de joies'
  },
  {
    name: 'Escales accés 5',
    type: 'Escales accés',
    positions: [
      [179, 597],
      [179, 621],
      [149, 621],
      [149, 597]
    ],
    info: 'Escales accés 5'
  },
  {
    name: 'Gate A4',
    type: 'Gate',
    positions: [
      [254, 621],
      [254, 790],
      [192, 790],
      [192, 895],
      [51, 895],
      [51, 621]
    ],
    info: 'Porta embarcament A4'
  },
  {
    name: 'Caixer 2',
    type: 'Caixer',
    positions: [
      [255, 827],
      [255, 791],
      [196, 791],
      [196, 827],
    ],
    info: 'Caixer ATM'
  },
  {
    name: 'Carrega electrica',
    type: 'Servei',
    positions: [
      [103, 514],
      [103, 601],
      [77, 601],
      [77, 618],
      [4, 618],
      [4, 514]
    ],
    info: 'Punt de càrrega dels vehicles elèctrics'
  },
  {
    name: 'Sortida sud',
    type: 'Sortida',
    positions: [
      [57, 462],
      [57, 512],
      [21, 512],
      [21, 462]
    ],
    info: 'Sortida de la secció sud'
  },
  {
    name: 'Sortida sud-oest',
    type: 'Sortida',
    positions: [
      [57, 196],
      [57, 247],
      [22, 247],
      [22, 196]
    ],
    info: 'Sortida de la secció sud-oest'
  },
  {
    name: 'H&M',
    type: 'Tenda',
    positions: [
      [406, 790],
      [406, 860],
      [360, 860],
      [360, 790]
    ],
    info: 'Tenda de roba'
  },
  {
    name: 'Adidas',
    type: 'Tenda',
    positions: [
      [319, 790],
      [319, 860],
      [359, 860],
      [359, 790]
    ],
    info: 'Tenda articles esportius'
  },
  {
    name: 'Enrique Tomas',
    type: 'Menjar',
    positions: [
      [318, 790],
      [318, 860],
      [277, 860],
      [277, 790]
    ],
    info: 'Entrepans i tapes de pernil'
  },
  {
    name: 'Gate A3',
    type: 'Gate',
    positions: [
      [190, 87],
      [190, 193],
      [126, 193],
      [126, 87]
    ],
    info: 'Porta embarcament A3'
  },
  {
    name: 'Escales accés 6',
    type: 'Escales accés',
    positions: [
      [93, 87],
      [93, 193],
      [124, 193],
      [124, 87]
    ],
    info: 'Escales accés 6'
  },
  {
    name: 'Seguretat sud-oest',
    type: 'Seguretat',
    positions: [
      [91, 89],
      [91, 194],
      [22, 194],
      [22, 89]
    ],
    info: 'Control de seguretat de la secció sud-oest'
  },
  {
    name: 'Zona de maletes',
    type: 'Servei',
    positions: [
      [159, 307],
      [159, 244],
      [81, 244],
      [81, 307]
    ],
    info: 'Recollida de maletes'
  },
  {
    name: 'Venta bitllets',
    type: 'Servei',
    positions: [
      [159, 405],
      [159, 468],
      [81, 468],
      [81, 405]
    ],
    info: 'Venta de bitllets avió'
  },
  
];

const MapaLeafletAdmin = () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow', 'pink', 'teal', 'brown', 'black'];

  const generateRandomPositions = (num) => {
    const positions = [];
    for (let i = 0; i < num; i++) {
      const offsetLat = (Math.random() - 0.5) * offsetY;
      const offsetLng = (Math.random() - 0.5) * offsetX;
      positions.push([baseY + offsetLat, baseX + offsetLng]);
    }
    return positions;
  };

  const [carPositions, setCarPositions] = useState(generateRandomPositions(NUM_CARS));
  const [userPositions, setUserPositions] = useState(generateRandomPositions(NUM_USERS));

  useEffect(() => {
    const interval = setInterval(() => {
      const minY = 0;
      const maxY = imageHeight;
      const minX = 0;
      const maxX = imageWidth;

      setCarPositions((positions) =>
        positions.map(([lat, lng]) => {
          const newLat = Math.min(maxY, Math.max(minY, lat + (Math.random() - 0.5) * 10));
          const newLng = Math.min(maxX, Math.max(minX, lng + (Math.random() - 0.5) * 10));
          return [newLat, newLng];
        })
      );

      setUserPositions((positions) =>
        positions.map(([lat, lng]) => {
          const newLat = Math.min(maxY, Math.max(minY, lat + (Math.random() - 0.5) * 5));
          const newLng = Math.min(maxX, Math.max(minX, lng + (Math.random() - 0.5) * 5));
          return [newLat, newLng];
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      center={[baseY, baseX]}
      zoom={0}
      style={{ height: '100%', width: '100%' }}
      minZoom={-1}
    >
      <ImageOverlay url={plano} bounds={bounds} />

      {zones.map((zone, index) => (
        <Polygon
          key={index}
          positions={zone.positions}
          pathOptions={{
            color: getColorByType(zone.type),
            weight: 1,
            fillOpacity: 0,
            opacity: 0.6
          }}
          eventHandlers={{
            mouseover: (e) => {
              e.target.setStyle({ weight: 2, color: 'yellow' });
            },
            mouseout: (e) => {
              e.target.setStyle({ weight: 1, color: getColorByType(zone.type) });
            }
          }}
        >
          <Tooltip>{zone.name}</Tooltip>
          <Popup>
            <strong>{zone.name}</strong><br />
            {zone.info}
          </Popup>
        </Polygon>
      ))}

      {/* Coches simulados */}
      {carPositions.map((pos, index) => (
        <Marker
          key={`car-${index}`}
          position={pos}
          icon={customCarIcon(colors[index % colors.length])}
        >
          <Popup>Coche #{index + 1}</Popup>
        </Marker>
      ))}

      {/* Usuarios simulados */}
      {userPositions.map((pos, index) => (
        <Marker
          key={`user-${index}`}
          position={pos}
          icon={customUserIcon()}
        >
          <Popup>Usuario con reserva #{index + 1}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapaLeafletAdmin;

