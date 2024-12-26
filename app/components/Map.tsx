'use client';

import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

// Fix for broken marker icons
import 'leaflet/dist/leaflet.css';
import { PiMapPinFill } from "react-icons/pi";
import { renderToString } from 'react-dom/server';

interface MapProps {
    center?: number[];
    zoomed?: boolean;
}

const Map: React.FC<MapProps> = ({ 
    center, // No default so that zoom is not set if center is not provided
    zoomed = false,
}) => {
    // Create a custom DivIcon using the FaMapMarker icon
    const customIcon = L.divIcon({
        html: renderToString(<PiMapPinFill color="004aad" size={40} />),
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
    });

    return (
        <MapContainer
            center={center as L.LatLngExpression || [51.523, -0.724]}
            zoom={zoomed ? 15 : center ? 4 : 2}
            scrollWheelZoom={false}
            className='h-[35vh] rounded-lg'
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {center && (
                <Marker 
                    position={center as L.LatLngExpression}
                    icon={customIcon}
                />    
            )}
        </MapContainer>
    );
}

export default Map;