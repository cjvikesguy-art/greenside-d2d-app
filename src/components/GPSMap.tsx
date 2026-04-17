import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, NavigationOff, Layers, Edit2, Trash2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import type { KnockRecord, TerritoryRecord } from '../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const locationIcon = L.divIcon({
  className: 'custom-location-icon',
  html: `<div class="w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white shadow-md"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const createHistoryIcon = (type: string) => {
  let color = '#ffffff'; // notHome = white
  let border = '#374151'; // dark border for white
  if (type === 'notInterested') { color = '#ef4444'; border = '#ffffff'; } // red
  if (type === 'lead') { color = '#3b82f6'; border = '#ffffff'; } // blue
  if (type === 'sale') { color = '#c5a059'; border = '#ffffff'; } // gold

  return L.divIcon({
    className: 'history-pin',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid ${border}; box-shadow: 0 1px 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

interface GPSMapProps {
  location: { lat: number; lng: number } | null;
  error: string;
  followMe: boolean;
  setFollowMe: (val: boolean) => void;
  history: KnockRecord[];
  territories: TerritoryRecord[];
  onTerritoryCreate: (payload: any) => void;
  activeAction: string | null;
  onMapClick: (lat: number, lng: number) => void;
  isAdmin: boolean;
  repName: string;
  onEditRecord: (record: KnockRecord) => void;
  onDeleteRecord: (id: string) => void;
}

const MapRecenter = ({ location, followMe }: { location: { lat: number; lng: number } | null, followMe: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (followMe && location) {
      map.setView([location.lat, location.lng], map.getZoom(), { animate: true });
    }
  }, [location, followMe, map]);
  return null;
};

const GeomanSetup = ({ onTerritoryCreate }: { onTerritoryCreate: (payload: any) => void }) => {
  const map = useMap();
  useEffect(() => {
    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawPolygon: true,
      drawRectangle: true,
      drawCircle: false,
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
      drawText: false
    });

    map.on('pm:create', (e) => {
      const layer = e.layer as any;
      const type = e.shape;
      const latlngs = layer.getLatLngs ? layer.getLatLngs() : layer.getLatLng();
      const payload = { layer_type: type, latlngs: latlngs };
      map.removeLayer(layer);
      onTerritoryCreate(payload);
    });

    return () => {
      map.pm.removeControls();
      map.off('pm:create');
    };
  }, [map, onTerritoryCreate]);

  return null;
};

const MapInteraction = ({ onMapClick, activeAction }: { onMapClick: (lat: number, lng: number) => void, activeAction: string | null }) => {
  const map = useMapEvents({
    click(e) {
      if (activeAction) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });

  useEffect(() => {
    if (activeAction) {
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.getContainer().style.cursor = '';
    }
  }, [activeAction, map]);

  return null;
};

export const GPSMap = ({ 
  location, 
  error, 
  followMe, 
  setFollowMe, 
  history, 
  territories, 
  onTerritoryCreate,
  activeAction,
  onMapClick,
  isAdmin,
  repName,
  onEditRecord,
  onDeleteRecord
}: GPSMapProps) => {
  const [isSatellite, setIsSatellite] = useState(false);
  const defaultCenter: [number, number] = [44.9778, -93.2650];

  const getTypeText = (type: string) => {
    switch(type) {
      case 'notHome': return 'Not Home';
      case 'notInterested': return 'Not Interested';
      case 'lead': return 'Lead';
      case 'sale': return 'Sale';
      default: return type;
    }
  };

  return (
    <div className={`flex-grow flex flex-col mx-4 my-2 mb-4 overflow-hidden rounded-2xl shadow-inner relative z-10 border transition-all duration-300 ${activeAction ? 'ring-4 ring-blue-400 border-blue-500' : 'border-gray-200'}`}>
      <MapContainer 
        center={location ? [location.lat, location.lng] : defaultCenter} 
        zoom={17} 
        className="w-full h-full z-0 font-sans"
        zoomControl={false}
      >
        <MapInteraction onMapClick={onMapClick} activeAction={activeAction} />
        
        <TileLayer
          attribution='&copy; React Leaflet'
          url={isSatellite 
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          }
          maxZoom={19}
        />

        {isAdmin && <GeomanSetup onTerritoryCreate={onTerritoryCreate} />}
        
        {territories.map((t) => {
          if (t.latlngs) {
            return (
              <Polygon 
                key={t.id} 
                positions={t.latlngs} 
                pathOptions={{ color: t.color || '#3b82f6', fillColor: t.color || '#3b82f6', fillOpacity: 0.2, weight: 2 }}
              >
                {t.label && <Popup className="rounded-xl font-sans font-bold">{t.label}</Popup>}
              </Polygon>
            )
          }
          return null;
        })}

        {history.map((record) => {
          if (record.lat && record.lng) {
            return (
              <Marker 
                key={record.id} 
                position={[record.lat, record.lng]} 
                icon={createHistoryIcon(record.type)}
              >
                <Popup className="rounded-xl font-sans min-w-[140px]">
                  <div className="p-1">
                    <p className="font-bold text-gray-800 m-0">{getTypeText(record.type)}</p>
                    {record.name && <p className="text-sm m-0 mt-1">{record.name}</p>}
                    <p className="text-xs text-gray-500 m-0 mt-1">Rep: {record.repName}</p>
                    {record.price && <p className="text-xs font-bold text-rolex-green m-0 mt-1">${record.price}</p>}
                    
                    {record.repName === repName && (
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                        <button onClick={() => onEditRecord(record)} className="text-blue-500 hover:bg-blue-50 rounded p-1 transition-colors flex items-center space-x-1 text-xs font-bold">
                          <Edit2 size={12}/> <span>Edit</span>
                        </button>
                        <button onClick={() => onDeleteRecord(record.id)} className="text-red-500 hover:bg-red-50 rounded p-1 transition-colors flex items-center space-x-1 text-xs font-bold">
                          <Trash2 size={12}/> <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
        
        {location && <Marker position={[location.lat, location.lng]} icon={locationIcon} />}
        <MapRecenter location={location} followMe={followMe} />
      </MapContainer>

      <div className="absolute top-4 right-4 z-[400]">
        <button
          onClick={() => setIsSatellite(!isSatellite)}
          className={`p-3 rounded-full shadow-lg transition-colors border ${isSatellite ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-700 border-gray-200'}`}
          title="Toggle Satellite View"
        >
          <Layers size={20} />
        </button>
      </div>

      <button
        onClick={() => setFollowMe(!followMe)}
        className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg z-[400] transition-colors border ${followMe ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
        title="Follow My Location"
      >
        {followMe ? <Navigation size={24} /> : <NavigationOff size={24} />}
      </button>

      <div className="absolute top-2 left-2 z-[400] pointer-events-none">
        {!location && error && (
          <div className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg shadow-sm border border-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
