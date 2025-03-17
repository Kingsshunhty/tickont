import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Default position (Latitude, Longitude)
const position = [40.7128, -74.006]; // New York City

const MapComponent = () => {
  return (
    <div className="h-[400px] w-full">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker */}
        <Marker position={position}>
          <Popup>New York City 📍</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
