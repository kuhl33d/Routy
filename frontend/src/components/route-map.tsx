import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect } from 'react'

const morningRoute = [
  [37.7749, -122.4194],
  [37.7833, -122.4167],
  // Add more coordinates
]

const afternoonRoute = [
  [37.7749, -122.4194],
  [37.785, -122.42],
  // Add more coordinates
]

export default function RouteMap({ type }: { type: "morning" | "afternoon" }) {
  const route = type === "morning" ? morningRoute : afternoonRoute
  const routeColor = type === "morning" ? "#F7B32B" : "#4CAF50"

  useEffect(() => {
    // Force a resize event after the map is loaded
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  return (
    <MapContainer
      center={[37.7749, -122.4194]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={route} color={routeColor} weight={3} />
    </MapContainer>
  )
}