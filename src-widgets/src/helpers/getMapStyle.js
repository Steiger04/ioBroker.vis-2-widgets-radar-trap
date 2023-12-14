const getMapStyle = (key, data) => {
    const getmapStyles = {
        route: {
            id: 'route',
            type: 'line',
            source: 'directions',
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            paint: {
                'line-color': data.routeColor || '#9C27B0',
                'line-width': data.routeWidth,
                'line-opacity': 0.8,
            },
        },
        speedTraps: {
            id: 'speed-traps',
            type: 'circle',
            source: 'traps',
            filter: ['match', ['get', 'type_name'], 'speed-trap', true, false],
            paint: {
                'circle-opacity': 0.3,
                'circle-color': [
                    'step',
                    ['to-number', ['get', 'vmax']],
                    '#ff0000',
                    80,
                    '#00ff00',
                ],
                'circle-radius': [
                    'step',
                    ['to-number', ['get', 'vmax']],
                    15,
                    99,
                    18,
                ],
            },
        },
        speedTrapsVmax: {
            id: 'speed-traps-vmax',
            type: 'symbol',
            source: 'traps',
            filter: ['match', ['get', 'type_name'], 'speed-trap', true, false],
            layout: {
                'text-allow-overlap': true,
                'text-field': '{vmax}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
            },
        },
        traps: {
            id: 'traps',
            type: 'symbol',
            source: 'traps',
            layout: {
                'icon-allow-overlap': true,
                'icon-image': [
                    'match',
                    ['get', 'type_name'],
                    ...[
                        ...(data.fixedTrap ? ['fixed-trap', 'icon-fixed-trap'] : ['']),
                        ...(data.mobileTrap ? ['mobile-trap', 'icon-mobile-trap'] : ['']),
                        ...(data.trafficJam ? ['traffic-jam', 'icon-traffic-jam'] : ['']),
                        ...(data.roadWork ? ['road-work', 'icon-road-work'] : ['']),
                        ...(data.accident ? ['accident', 'icon-accident'] : ['']),
                        ...(data.object ? ['object', 'icon-object'] : ['']),
                        ...(data.sleekness ? ['sleekness', 'icon-sleekness'] : ['']),
                        ...(data.fog ? ['fog', 'icon-fog'] : ['']),
                        ...(data.policeNews ? ['police-news', 'icon-police-news'] : ['']),
                    ].filter(item => item !== ''),
                    'dummy',
                    'icon-object',
                    '',
                ],
                'icon-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    0.4,
                    8,
                    0.8,
                    10,
                    1.2,
                    14,
                    1.6,
                ],
            },
            paint: {
                'icon-color': data.symbolColor || '#000000',
                'icon-opacity': 0.7,
            },
        },
        clusterTraps: {
            id: 'cluster-traps',
            type: 'circle',
            source: 'traps',
            filter: ['has', 'point_count'],
            paint: {
                'circle-opacity': 0.3,
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    data.clusterColor || '#e1bee7',
                    100,
                    data.clusterColor || '#e1bee7',
                    750,
                    data.clusterColor || '#e1bee7',
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    12,
                    9,
                    15,
                    99,
                    18,
                ],
            },
        },
        clusterTrapsCount: {
            id: 'cluster-traps-count',
            type: 'symbol',
            source: 'traps',
            filter: ['has', 'point_count'],
            layout: {
                'text-allow-overlap': true,
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
            },
        },
        lineBackground: {
            id: 'line-background',
            type: 'line',
            source: 'polys',
            paint: {
                'line-color': 'red',
                'line-width': 6,
                'line-opacity': 0.4,
            },
        },
        lineDashed: {
            id: 'line-dashed',
            type: 'line',
            source: 'polys',
            paint: {
                /* "line-color": "red", */
                'line-color': ['match', ['get', 'type'], '20', 'red', 'white'],
                'line-width': 6,
                'line-dasharray': [0, 4, 3],
            },
        },
        trafficClosure: {
            id: 'traffic-closure',
            type: 'symbol',
            source: 'polys',
            filter: ['all', ['==', 'type', 'closure'], ['==', '$type', 'Point']],
            layout: {
                'icon-allow-overlap': true,
                'icon-image': 'icon-traffic-closure',
                'icon-size': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    6,
                    0.2,
                    10,
                    0.3,
                    14,
                    0.4,
                ],
            },
            paint: {
                'icon-opacity': 0.7,
            },
        },
        areaSurface: {
            id: 'area-surface',
            type: 'fill',
            source: 'areaPolygons',
            paint: {
                'fill-color': data.polygonColor || '#4dabf5',
                'fill-opacity': data.polygonOpacity || 0.1,
            },
        },
        areaSurfaceBorder: {
            id: 'area-surface-border',
            type: 'line',
            source: 'areaPolygons',
            paint: {
                'line-color': data.polygonBorderColor || '#4dabf5',
                'line-width': data.polygonBorder || 2,
            },
        },
    };

    return getmapStyles[key];
};

export { getMapStyle };
