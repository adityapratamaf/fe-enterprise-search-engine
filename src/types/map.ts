/** Shared map types. Not backend contracts — these describe the UI's own view state. */

/** Latitude/longitude pair in the order Leaflet expects. */
export type LatLng = [lat: number, lng: number];

/** South-west and north-east corners, matching the API's latMin/lonMin/latMax/lonMax. */
export type MapBounds = {
  latMin: number;
  lonMin: number;
  latMax: number;
  lonMax: number;
};

export type MapView = {
  center: LatLng;
  zoom: number;
};
