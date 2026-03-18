import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

interface MapProps {
  address: string;
  city: string;
  state: string;
  country: string;
}

const Map: React.FC<MapProps> = ({ address, city, state, country }) => {
  // IMPORTANT: You need to get an API key from Google Cloud Platform and put it in your .env file.
  // The variable name should be VITE_GOOGLE_MAPS_API_KEY.
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [center, setCenter] = React.useState({ lat: -3.745, lng: -38.523 }); // Default center

  React.useEffect(() => {
    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder();
      const fullAddress = `${address}, ${city}, ${state}, ${country}`;
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results) {
          const location = results[0].geometry.location;
          setCenter({ lat: location.lat(), lng: location.lng() });
          if (map) {
            map.panTo({ lat: location.lat(), lng: location.lng() });
          }
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  }, [isLoaded, address, city, state, country, map]);

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <div className="flex size-full  items-center justify-center bg-gray-200">
      <p>Loading map...</p>
    </div>
  );
};

export default React.memo(Map);
