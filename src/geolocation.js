// import { createObservable } from "./observables/createObservable.js";

const { Subject } = window.rxjs;

const createObservable = subscriber => new Observable(subscriber);

export const watchPosition = () => {
    const subject$ = new Subject();

    const id = window.navigator.geolocation.watchPosition(
        ({
            timestamp,
            coords,
        }) => {
            subject$.next({
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
        (e) => {
            subject$.error(e.message)
        },
        {
            enableHighAccuracy: true,
            maximumAge: 10,
            timeout: 27000,
        }
    );

    return subject$.asObservable();

    // return () => {
    //     window.navigator.geolocation.clearWatch(id);
    // };
};

export const clearWatchPosition = (id) => navigator.geolocation.clearWatch(id);

export const getGeolocationPermission = () => navigator.permissions.query({ name: 'geolocation' });
