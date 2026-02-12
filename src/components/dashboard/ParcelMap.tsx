import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { parcels } from '../../data/mockData';

export function ParcelMap() {
  const getColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return '#22c55e'; // green-500
      case 'ALERT': return '#ef4444'; // red-500
      case 'HARVEST': return '#eab308'; // yellow-500
      default: return '#3b82f6';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-[400px] z-0">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">Carte des Parcelles</h3>
        <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Sain</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Alerte</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Récolte</span>
        </div>
      </div>
      <MapContainer 
        center={[4.0511, 9.7085]} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parcels.map((parcel) => (
          <CircleMarker
            key={parcel.id}
            center={[parcel.lat, parcel.lng]}
            radius={20}
            pathOptions={{ 
              color: getColor(parcel.status),
              fillColor: getColor(parcel.status),
              fillOpacity: 0.6
            }}
          >
            <Popup>
              <div className="p-1">
                <h4 className="font-bold text-slate-900">{parcel.name}</h4>
                <p className="text-sm text-slate-600">{parcel.area} Hectares</p>
                <span className="text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded bg-slate-100">
                  {parcel.status}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
