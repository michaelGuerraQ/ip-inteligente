/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Component to update map view when coordinates change
 */
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

const IPMap = ({ lat, lon, city, country, t }) => {
  const position = [lat || 0, lon || 0];

  return (
    <div className="glass rounded-3xl overflow-hidden glow-indigo h-[400px] relative z-0">
      <div className="absolute top-4 left-4 z-[1000] glass px-4 py-2 rounded-xl border border-white/10 shadow-xl">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-80">
          {t.interactiveMap}
        </h3>
      </div>
      
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        <Marker position={position}>
          <Popup>
            <div className="font-sans">
              <p className="font-bold">{city}</p>
              <p className="text-xs opacity-60">{country}</p>
            </div>
          </Popup>
        </Marker>
        <ChangeView center={position} />
      </MapContainer>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container {
          background: #050505 !important;
        }
        .map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        body.light .map-tiles {
          filter: none;
        }
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.5) !important;
          color: #fff !important;
          font-size: 8px !important;
        }
        .leaflet-bar a {
          background-color: rgba(15, 15, 15, 0.8) !important;
          color: #fff !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        body.light .leaflet-bar a {
          background-color: #fff !important;
          color: #000 !important;
        }
      `}} />
    </div>
  );
};

export default IPMap;
