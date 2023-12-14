import { useEffect, useCallback, useRef } from 'react';

const dashArraySequence = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
    [0, 3.5, 3, 0.5],
];

const useAnimationFrame = (editMode, map, mapImageStatus, closedCongestedRoad, animateClosedCongestedRoad) => {
    // if (editMode || !animateClosedCongestedRoad || !map.current)  return;

    const frame = useRef(0);
    const mounted = useRef(false);

    const animateDashArray = useCallback((timestamp, step) => {
        if (!map.current) return step;

        const newStep = parseInt(
            (timestamp / 50) %
                dashArraySequence.length,
        );

        if (newStep !== step) {
            map.current.getMap().setPaintProperty(
                'line-dashed',
                'line-dasharray',
                dashArraySequence[step],
            );
            step = newStep;
        }

        // eslint-disable-next-line consistent-return
        return step;
    }, [map]);

    const animate = useCallback((timestamp, step) => {
        const newStep = animateDashArray(timestamp, step);

        frame.current = requestAnimationFrame(ts => animate(ts, newStep));
    }, [animateDashArray]);

    useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, []);

    useEffect(() => {
        if (!editMode && mounted.current === true && mapImageStatus === 'success' && closedCongestedRoad && animateClosedCongestedRoad) {
            frame.current = requestAnimationFrame(timestamp => animate(timestamp, 0));
        } else {
            cancelAnimationFrame(frame.current);
        }

        return () => cancelAnimationFrame(frame.current);
    }, [editMode, mapImageStatus, closedCongestedRoad, animateClosedCongestedRoad, animate]);
};

export { useAnimationFrame };
