import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polygon } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const defaultCenter = { lat: 13.0827, lng: 80.2707 }; // Chennai
const mapContainerStyle = { width: '100%', height: '400px' };

interface Location {
  lat: number;
  lng: number;
}

// Hook for loading Google Maps
export function useGoogleMaps() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'drawing'],
  });
  return { isLoaded, loadError };
}

// Location picker component
export function LocationPicker({
  value,
  onChange,
  zoom = 14,
}: {
  value?: Location;
  onChange: (location: Location, address?: string) => void;
  zoom?: number;
}) {
  const { isLoaded } = useGoogleMaps();
  const [marker, setMarker] = useState<Location | null>(value || null);

  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarker(location);

    // Reverse geocode to get address
    const geocoder = new google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({ location });
      const address = result.results[0]?.formatted_address;
      onChange(location, address);
    } catch {
      onChange(location);
    }
  }, [onChange]);

  if (!isLoaded) return <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={marker || defaultCenter}
      zoom={zoom}
      onClick={handleMapClick}
      options={{ streetViewControl: false, mapTypeControl: false }}
    >
      {marker && <Marker position={marker} draggable onDragEnd={(e) => e.latLng && handleMapClick({ latLng: e.latLng } as google.maps.MapMouseEvent)} />}
    </GoogleMap>
  );
}

// Zone map with polygon
export function ZoneMap({
  zones,
  selectedZoneId,
  onZoneClick,
}: {
  zones: Array<{ id: string; name: string; coordinates: Location[] }>;
  selectedZoneId?: string;
  onZoneClick?: (zoneId: string) => void;
}) {
  const { isLoaded } = useGoogleMaps();

  if (!isLoaded) return <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={11}
      options={{ streetViewControl: false }}
    >
      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          paths={zone.coordinates}
          options={{
            fillColor: selectedZoneId === zone.id ? '#3b82f6' : '#6b7280',
            fillOpacity: 0.3,
            strokeColor: selectedZoneId === zone.id ? '#2563eb' : '#4b5563',
            strokeWeight: 2,
          }}
          onClick={() => onZoneClick?.(zone.id)}
        />
      ))}
    </GoogleMap>
  );
}

// Delivery tracking map
export function DeliveryTrackingMap({
  deliveryLocation,
  destinationLocation,
  agentName,
}: {
  deliveryLocation: Location;
  destinationLocation: Location;
  agentName: string;
}) {
  const { isLoaded } = useGoogleMaps();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: deliveryLocation,
        destination: destinationLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') setDirections(result);
      }
    );
  }, [isLoaded, deliveryLocation, destinationLocation]);

  // Use directions for route display (placeholder for DirectionsRenderer)
  console.log('Directions loaded:', !!directions);

  if (!isLoaded) return <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" />;

  return (
    <GoogleMap
      mapContainerStyle={{ ...mapContainerStyle, height: '300px' }}
      center={deliveryLocation}
      zoom={14}
    >
      <Marker
        position={deliveryLocation}
        icon={{ url: '/delivery-icon.png', scaledSize: new google.maps.Size(40, 40) }}
        title={agentName}
      />
      <Marker position={destinationLocation} title="Delivery Address" />
    </GoogleMap>
  );
}

// Address autocomplete hook
export function useAddressAutocomplete(inputRef: React.RefObject<HTMLInputElement | null>) {
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'in' },
      fields: ['address_components', 'geometry', 'formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.address_components) {
        const getComponent = (type: string) =>
          place.address_components?.find((c) => c.types.includes(type))?.long_name || '';

        return {
          addressLine1: place.formatted_address?.split(',')[0] || '',
          city: getComponent('locality'),
          state: getComponent('administrative_area_level_1'),
          pincode: getComponent('postal_code'),
          location: place.geometry?.location
            ? { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
            : null,
        };
      }
    });
  }, [isLoaded, inputRef]);

  return { isLoaded };
}

// Store locator
export function StoreLocator({
  stores,
  userLocation,
  onStoreSelect,
}: {
  stores: Array<{ id: string; name: string; address: string; location: Location }>;
  userLocation?: Location;
  onStoreSelect: (storeId: string) => void;
}) {
  const { isLoaded } = useGoogleMaps();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  if (!isLoaded) return <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={userLocation || defaultCenter}
      zoom={12}
    >
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{ url: '/user-location.png', scaledSize: new google.maps.Size(30, 30) }}
        />
      )}
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={store.location}
          title={store.name}
          onClick={() => {
            setSelectedStore(store.id);
            onStoreSelect(store.id);
          }}
          icon={selectedStore === store.id ? undefined : { url: '/store-icon.png', scaledSize: new google.maps.Size(35, 35) }}
        />
      ))}
    </GoogleMap>
  );
}
