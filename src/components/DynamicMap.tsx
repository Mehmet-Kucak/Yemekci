"use client";
import Map, { NavigationControl, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "@styles/home.module.css";

export default function DynamicMap({ start, end }: { start: [number, number]; end: [number, number] }) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className={styles.container}>
      <Map
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={{ latitude: start[0], longitude: start[1], zoom: 10 }}
        maxZoom={20}
        minZoom={3}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
}
