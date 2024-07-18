import { setBackgroundColor } from "./background.js";

const { BehaviorSubject, exhaustMap, map, filter, forkJoin, concat, of, Observable, scan, mergeMap, Subject, take, tap } = window.rxjs;

const createTouchStream = () => {
    const stream$ = new Observable((subscriber) => {
        document.addEventListener('touchstart', e => {
            const { touches, changedTouches } = e;
            subscriber.next({
                touches,
                changedTouches,
            });
        });
    });

    return stream$;
};

const PADDING = 50;

const isInCorner = (touch, topOrBottom, leftOrRight) => {
    const minY = topOrBottom === 'top' ? 0 : window.innerHeight - PADDING;
    const maxY = topOrBottom === 'top' ? PADDING : window.innerHeight;
    const minX = leftOrRight === 'left' ? 0 : window.innerWidth - PADDING;
    const maxX = leftOrRight === 'left' ? PADDING : window.innerWidth;

    const { screenX, screenY } = touch;
    return (
        screenX >= minX &&
        screenX <= maxX &&
        screenY >= minY &&
        screenY <= maxY
    );
};



export const createTouchDemo = () => {

    const touch$ = new Subject();
    createTouchStream().subscribe(touch$);

    const singleTouch$ = touch$.pipe(
        filter(({ touches }) => touches.length === 1),
        map(({ touches }) => touches[0]),
    );

    const topLeftTouch$ = singleTouch$.pipe(
        filter(touch => isInCorner(touch, 'top', 'left')),
    );
    const topRightTouch$ = singleTouch$.pipe(
        filter(touch => isInCorner(touch, 'top', 'right')),
    );
    const bottomLeftTouch$ = singleTouch$.pipe(
        filter(touch => isInCorner(touch, 'bottom', 'left')),
    );
    const bottomRightTouch$ = singleTouch$.pipe(
        filter(touch => isInCorner(touch, 'bottom', 'right')),
    );

    const demoMode$ = new BehaviorSubject(false);
    // concat(of('start'), demoMode$).pipe(
    topLeftTouch$.pipe(
        tap(v=>console.log(v)),
        mergeMap(() => forkJoin([
            // $topLeftTouch.pipe(tap(() => console.log('top left')), take(1)),
            topRightTouch$.pipe(tap(() => console.log('top right')), take(1)),
            bottomRightTouch$.pipe(tap(() => console.log('bottom right')), take(1)),
            bottomLeftTouch$.pipe(tap(() => console.log('bottom left')), take(1)),
        ])),
        scan((acc, d) => !acc, false),
    ).subscribe(demoMode$);

    demoMode$.subscribe({
        next: (active) => {
            console.log(active ? 'activated' : 'deactivated');
            setBackgroundColor(active ? 'pink': 'green');
        }
    });

    return {
        touch$,
        demoMode$,
        topLeftTouch$,
        topRightTouch$,
        bottomLeftTouch$,
        bottomRightTouch$,
    };

    // demoMode$.pipe(
    //     filter(active => Boolean(active)),
    // ).subscribe()
}
