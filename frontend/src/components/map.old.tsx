import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression, Icon } from "leaflet";
import { useDriverStore } from "@/stores/driver.store";
import { Route } from "@/types/driver.types";

// Custom marker icon
const customIcon = new Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  driverId: string; // Pass the driver's ID to fetch their route
}

export default function Map({ driverId }: MapProps) {
  const { getCurrentRoute, loading } = useDriverStore();
  const [routeData, setRouteData] = useState<Route | null>(null);

  // Fetch the driver's current route
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const route = await getCurrentRoute(driverId);
        setRouteData(route);
      } catch (error: any) {
        console.error("Failed to fetch route:", error);
      }
    };
    fetchRoute();
  }, [driverId, getCurrentRoute]);

  // Component to handle map resizing and bounds fitting
  const MapAdjuster = () => {
    const map = useMap();

    useEffect(() => {
      // Fix map rendering issue by invalidating size
      map.invalidateSize();

      // Fit bounds to the route if it exists
      if (routeData) {
        const positions: [number, number][] = [
          [routeData.startLocation.coordinates.latitude, routeData.startLocation.coordinates.longitude],
          ...routeData.stops.map(stop => [
            stop.address.coordinates.latitude,
            stop.address.coordinates.longitude,
          ] as [number, number]),
          [routeData.endLocation.coordinates.latitude, routeData.endLocation.coordinates.longitude],
        ];
        if (positions.length > 0) {
          const bounds = L.latLngBounds(positions);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }, [map, routeData]);

    return null;
  };

  if (loading || !routeData) {
    return <div>Loading map...</div>;
  }

  // Prepare route coordinates for the polyline
  const routePositions: [number, number][] = [
    [routeData.startLocation.coordinates.latitude, routeData.startLocation.coordinates.longitude],
    ...routeData.stops.map(stop => [
      stop.address.coordinates.latitude,
      stop.address.coordinates.longitude,
    ] as [number, number]),
    [routeData.endLocation.coordinates.latitude, routeData.endLocation.coordinates.longitude],
  ];

  return (
    <MapContainer
      center={[routeData.startLocation.coordinates.latitude, routeData.startLocation.coordinates.longitude] as [number, number]}
      zoom={13}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Adjust map bounds and size */}
      <MapAdjuster />
      {/* Draw the route polyline */}
      {routePositions.length > 0 && (
        <Polyline positions={routePositions} color="#F7B32B" weight={3} />
      )}
      {/* Start marker */}
      <Marker
        position={[routeData.startLocation.coordinates.latitude, routeData.startLocation.coordinates.longitude] as [number, number]}
        icon={customIcon}
      >
        <Popup>Start: {routeData.startLocation.name}</Popup>
      </Marker>
      {/* Stop markers */}
      {routeData.stops.map((stop) => (
        <Marker
          key={stop._id}
          position={[stop.address.coordinates.latitude, stop.address.coordinates.longitude] as [number, number]}
          icon={customIcon}
        >
          <Popup>
            Stop: {stop.address.name} <br />
            Order: {stop.order} <br />
            Scheduled: {stop.scheduledTime} <br />
            Status: {stop.status}
          </Popup>
        </Marker>
      ))}
      {/* End marker */}
      <Marker
        position={[routeData.endLocation.coordinates.latitude, routeData.endLocation.coordinates.longitude] as [number, number]}
        icon={customIcon}
      >
        <Popup>End: {routeData.endLocation.name}</Popup>
      </Marker>
    </MapContainer>
  );
}