import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Route } from "@/types/driver.types";

// Fix for default marker icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProps {
  driverId: string;
  currentRoute?: Route | null; // Use this prop for dummy data
}

const Map: React.FC<MapProps> = ({ driverId, currentRoute }) => {
  // No fetchRoute function, use currentRoute prop directly
  const route = currentRoute;

  // Default to a center point if no route
  const center = route?.startLocation?.coordinates
    ? [route.startLocation.coordinates.latitude, route.startLocation.coordinates.longitude]
    : [37.7749, -122.4194]; // Default to San Francisco

  // Extract coordinates for polyline
  const coordinates = route
    ? [
        [route.startLocation.coordinates.latitude, route.startLocation.coordinates.longitude],
        ...route.stops.map((stop) => [
          stop.address.coordinates.latitude,
          stop.address.coordinates.longitude,
        ]),
        [route.endLocation.coordinates.latitude, route.endLocation.coordinates.longitude],
      ]
    : [[37.7749, -122.4194]]; // Default polyline if no route

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {route && (
        <>
          <Marker
            position={[route.startLocation.coordinates.latitude, route.startLocation.coordinates.longitude]}
          />
          {route.stops.map((stop) => (
            <Marker
              key={stop._id}
              position={[stop.address.coordinates.latitude, stop.address.coordinates.longitude]}
            />
          ))}
          <Marker
            position={[route.endLocation.coordinates.latitude, route.endLocation.coordinates.longitude]}
          />
          <Polyline positions={coordinates} color="blue" />
        </>
      )}
    </MapContainer>
  );
};

export default Map;