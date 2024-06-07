declare module '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions' {
    import { IControl } from 'mapbox-gl';
  
    export default class MapboxDirections implements IControl {
      constructor(options?: {
        accessToken: string;
        unit?: 'imperial' | 'metric';
        profile?: 'mapbox/driving' | 'mapbox/walking' | 'mapbox/cycling';
      });
  
      onAdd(map: mapboxgl.Map): HTMLElement;
      onRemove(map: mapboxgl.Map): void;
  
      setOrigin(origin: [number, number] | string): void;
      setDestination(destination: [number, number] | string): void;
      removeRoutes(): void;
    }
  }
  