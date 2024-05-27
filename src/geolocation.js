import { createObservable } from './observable.js';

export const watchPosition = () => {
    return createObservable((next, error, complete) => {
        const id = window.navigator.geolocation.watchPosition(
            ({
                timestamp,
                coords,
            }) => {
                next({
                    id,
                    timestamp,
                    accuracy: coords.accuracy,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    altitude: coords.altitude,
                    altitudeAccuracy: coords.altitudeAccuracy,
                    heading: coords.heading,
                    speed: coords.speed,
                });
            },
            (e) => { error(e.message) },
            {
                enableHighAccuracy: true,
                maximumAge: 10,
                timeout: 27000,
            }
        );

        return () => {
            window.navigator.geolocation.clearWatch(id);
        };
    });
};

export const clearWatchPosition = (id) => navigator.geolocation.clearWatch(id);
