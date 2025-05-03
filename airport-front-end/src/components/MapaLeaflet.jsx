import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import plano from '/src/components/assets/planol.png';

const imageWidth = 995;
const imageHeight = 630;
const bounds = [[0, 0], [imageHeight, imageWidth]];
const NUM_CARS = 10;
const baseY = imageHeight / 2;
const baseX = imageWidth / 2;
const offsetY = 100;
const offsetX = 150;

// Icono cuadrado de color
const customCarIcon = (color = 'red') =>
  L.divIcon({
    className: 'custom-car-marker',
    html: `<div style="
      width: 25px;
      height: 25px;
      background-color: ${color};
      border: 1px solid white;
      border-radius: 2px;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

// Función para asignar colores por tipo
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
    name: 'Farmàcia oest',
    type: 'Farmàcia',
    positions: [
      [295, 7],
      [295, 50],
      [216, 50],
      [216, 7]
    ],
    info: 'Venta de medicaments'
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
      [197, 65],
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
      [179, 622],
      [149, 622],
      [149, 597]
    ],
    info: 'Escales accés 5'
  },
  {
    name: 'Louis Vuitton',
    type: 'Tenda',
    positions: [
      [254, 622],
      [254, 786],
      [207, 786],
      [207, 622]
    ],
    info: 'Tenda de moda de luxe'
  },
  {
    name: 'Serveis sud-est',
    type: 'Serveis',
    positions: [
      [206, 623],
      [206, 676],
      [144, 676],
      [144, 623]
    ],
    info: 'Serveis de la secció sud-est'
  },
  {
    name: 'Caixer 2',
    type: 'Caixer',
    positions: [
      [161, 677],
      [161, 707],
      [141, 707],
      [141, 712],
      [125, 712],
      [125, 655],
      [141, 655],
      [141, 677]
    ],
    info: 'Caixer ATM'
  },
  {
    name: 'Punt informacio sud-est',
    type: 'Informacio',
    positions: [
      [191, 736],
      [191, 789],
      [143, 789],
      [143, 736]
    ],	
    info: 'Punt informació aeroport'
  },
  {
    name: 'Caixer 3',
    type: 'Caixer',
    positions: [
      [255, 790],
      [255, 827],
      [196, 827],
      [196, 790]
    ],
    info: 'Caixer ATM'
  },
  {
    name: 'Gate A4',
    type: 'Gate',
    positions: [
      [192, 791],
      [192, 895],
      [53, 895],
      [53, 791]
    ],
    info: 'Porta embarcament A4'
  },
  {
    name: 'Zona VIP',
    type: 'VIP',
    positions: [
      [101, 784],
      [101, 712],
      [52, 712],
      [52, 784]
    ],
    info: 'Zona VIP'
  },
  {
    name: 'Zara',
    type: 'Tendes',
    positions: [
      [101, 622],
      [101, 710],
      [52, 710],
      [52, 622]
    ],
    info: 'Tenda de roba'
  },
];

const IndoorMap = () => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow', 'pink', 'teal', 'brown', 'black'];

  const generateInitialPositions = () => {
    const positions = [];
    for (let i = 0; i < NUM_CARS; i++) {
      const offsetLat = (Math.random() - 0.5) * offsetY;
      const offsetLng = (Math.random() - 0.5) * offsetX;
      positions.push([baseY + offsetLat, baseX + offsetLng]);
    }
    return positions;
  };

  const [carPositions, setCarPositions] = useState(generateInitialPositions);

  useEffect(() => {
    const interval = setInterval(() => {
      const minY = baseY - offsetY / 2;
      const maxY = baseY + offsetY / 2;
      const minX = baseX - offsetX / 2;
      const maxX = baseX + offsetX / 2;
      setCarPositions((positions) =>
        positions.map(([lat, lng]) => {
          const newLat = Math.min(maxY, Math.max(minY, lat + (Math.random() - 0.5) * 10));
          const newLng = Math.min(maxX, Math.max(minX, lng + (Math.random() - 0.5) * 10));
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

      {/* Zonas fijas con Polygon */}
      {zones.map((zone, index) => (
        <Polygon
          key={index}
          positions={zone.positions}
          pathOptions={{ color: getColorByType(zone.type), weight: 1, fillOpacity: 0.2 }}
        >
          <Tooltip>{zone.name}</Tooltip>
          <Popup>
            <strong>{zone.name}</strong><br />
            {zone.info}
          </Popup>
        </Polygon>
      ))}

      {/* Coches en movimiento */}
      {carPositions.map((pos, index) => (
        <Marker
          key={`car-${index}`}
          position={pos}
          icon={customCarIcon(colors[index % colors.length])}
        >
          <Popup>Coche #{index + 1}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default IndoorMap;

