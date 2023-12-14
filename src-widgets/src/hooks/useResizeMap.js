import { useCallback, useEffect } from 'react';
import { useRadarTrapMapBox } from './useRadarTrapMapBox';

const useResizeMap = ({
    _id,
    width,
    height,
    feathersClient,
    map,
}) => {
    const { status: boxStatus, directionsBox } = useRadarTrapMapBox(_id, feathersClient);

    const resizeMap = useCallback(animate => {
        if (!map?.current) return;

        if (boxStatus === 'success') {
            map.current.resize();
            map.current.fitBounds(
                [
                    [directionsBox[0], directionsBox[1]],
                    [directionsBox[2], directionsBox[3]],
                ],
                { animate, padding: 10 },
            );
        }
    }, [boxStatus, directionsBox, map]);

    useEffect(() => {
        if (!map?.current) return;

        resizeMap(false);
    }, [height, width, map, resizeMap]);

    useEffect(() => {
        let resizeTimer;

        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeMap(false);
            }, 100);
        };

        window.removeEventListener('resize', handleResize);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [resizeMap]);

    return { resizeMap, boxStatus };
};

export { useResizeMap };
