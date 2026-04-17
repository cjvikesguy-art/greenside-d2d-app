import { useState, useEffect } from 'react';

export const useGeolocation = (followMe: boolean) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let watchId: number;

    if (followMe && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setError('');
        },
        (err) => {
          setError(err.message);
        },
        { enableHighAccuracy: true }
      );
    } else if (!followMe && location === null && navigator.geolocation) {
      // Just get one initial location if possible
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    }

    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [followMe]);

  return { location, error };
};
