import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import styles from "@styles/DynamicMap.module.css";

interface MapProps {
  start: [number, number];
  end: [number, number];
}

const Map: React.FC<MapProps> = ({ start, end }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (mapContainer.current && mapboxToken) {
      mapboxgl.accessToken = mapboxToken;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: start,
        zoom: 12,
      });

      map.on("load", () => {
        const directions = new MapboxDirections({
          accessToken: mapboxToken,
          unit: "metric",
          profile: "mapbox/driving",
          controls: {
            inputs: false,
            instructions: false,
            profileSwitcher: false,
          },
          interactive: false,
          language: "tr",
        } as any);

        map.addControl(directions, "top-left");

        directions.setOrigin(start);
        directions.setDestination(end);

        // Disable the inputs for origin and destination
        const originInput = document.querySelector(
          ".mapbox-directions-origin input"
        ) as HTMLInputElement;
        const destinationInput = document.querySelector(
          ".mapbox-directions-destination input"
        ) as HTMLInputElement;

        if (originInput) {
          originInput.disabled = true;
        }

        if (destinationInput) {
          destinationInput.disabled = true;
        }
      });

      map.addControl(new mapboxgl.NavigationControl());
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserLocation: true,
        })
      );
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();

      return () => {
        map.remove();
      };
    }
  }, [start, end, mapboxToken]);

  return <div ref={mapContainer} className={styles.container} />;
};

export default Map;
