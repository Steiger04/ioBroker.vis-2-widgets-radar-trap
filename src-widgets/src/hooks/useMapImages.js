import {
    useCallback, useEffect, useState, useRef,
} from 'react';

const images = [
    { id: 'icon-fixed-trap', png: 'widgets/vis-2-widgets-radar-trap/img/icon-fixed-trap.png' },
    { id: 'icon-mobile-trap', png: 'widgets/vis-2-widgets-radar-trap/img/icon-mobile-trap.png' },
    { id: 'icon-traffic-jam', png: 'widgets/vis-2-widgets-radar-trap/img/icon-traffic-jam.png' },
    { id: 'icon-road-work', png: 'widgets/vis-2-widgets-radar-trap/img/icon-road-work.png' },
    { id: 'icon-accident', png: 'widgets/vis-2-widgets-radar-trap/img/icon-accident.png' },
    { id: 'icon-object', png: 'widgets/vis-2-widgets-radar-trap/img/icon-object.png' },
    { id: 'icon-sleekness', png: 'widgets/vis-2-widgets-radar-trap/img/icon-sleekness.png' },
    { id: 'icon-fog', png: 'widgets/vis-2-widgets-radar-trap/img/icon-fog.png' },
    { id: 'icon-police-news', png: 'widgets/vis-2-widgets-radar-trap/img/icon-police-news.png' },
    {
        id: 'icon-traffic-closure',
        png: 'widgets/vis-2-widgets-radar-trap/img/icon-traffic-closure.png',
    },
];

const useMapImages = styleSelect => {
    const mapRef = useRef(null);
    const [status, setStatus] = useState('idle');
    const [loadImages, setLoadImages] = useState(null);

    const loadMapImages = useCallback(map => {
        mapRef.current = map;

        const loadedImages = [];
        const _loadImages = () => {
            setStatus('loading');
            for (const image of images) {
                if (!map.getMap().hasImage(image.id)) {
                    loadedImages.push(
                        new Promise((resolve, reject) => {
                            map.getMap().loadImage(image.png, (error, mapImage) => {
                                if (error) {
                                    reject(error);
                                }

                                map.getMap().addImage(
                                    image.id,
                                    mapImage,
                                    {
                                        sdf: image.id !== 'icon-traffic-closure',
                                    },
                                );
                                resolve();
                            });
                        }).catch(ex =>
                            console.log(
                                `useMapImages() -> loadImages() -> Error: ${ex}`,
                            )),
                    );
                }
            }
            Promise.all(loadedImages).then(() => setStatus('success')).catch(ex => console.log(ex));
        };

        setLoadImages(() => _loadImages);
    }, []);

    useEffect(() => {
        if (!mapRef?.current || !loadImages) return;
        mapRef.current.getMap().setStyle(`mapbox://styles/mapbox/${styleSelect || 'streets-v12'}`, { diff: false });
        loadImages();
    }, [styleSelect, loadImages, mapRef]);

    return {
        mapRef, status, loadMapImages,
    };
};

export { useMapImages };
