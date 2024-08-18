const getMapStyle = (key, data) => {
	const getmapStyles = {
		route: {
			id: "route",
			type: "line",
			source: "directions",
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint: {
				"line-color": data.routeColor || "#9C27B0",
				"line-width": data.routeWidth || 5,
				"line-opacity": 1.0,
			},
		},
		// Areas
		areaSurface: {
			id: "area-surface",
			type: "fill",
			source: "areaPolygons",
			paint: {
				"fill-color": data.polygonColor || "rgba(10,138,232,0.15)",
				"fill-opacity": 1.0,
			},
		},
		areaSurfaceBorder: {
			id: "area-surface-border",
			type: "line",
			source: "areaPolygons",
			paint: {
				"line-color": data.polygonBorderColor || "rgba(61,156,226,0.6)",
				"line-width": data.polygonBorder || 4,
			},
		},
		// cluster
		clusterTraps: {
			id: "cluster-traps",
			type: "circle",
			source: "traps",
			filter: ["has", "point_count"],
			paint: {
				"circle-opacity": 1.0,
				"circle-color": [
					"step",
					["get", "point_count"],
					data.clusterColor || "rgba(197,14,228,0.4)",
					100,
					data.clusterColor || "rgba(197,14,228,0.4)",
					750,
					data.clusterColor || "rgba(197,14,228,0.4)",
				],
				"circle-radius": ["step", ["get", "point_count"], 12, 9, 15, 100, 18],
			},
		},
		clusterTrapsCount: {
			id: "cluster-traps-count",
			type: "symbol",
			filter: ["has", "point_count"],
			layout: {
				"text-allow-overlap": true,
				"text-size": 12,
				"text-field": [
					"format",
					["get", "point_count_abbreviated"],
					{
						"text-font": [
							"literal",
							["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
						],
						"text-color": data.clusterTextColor || "rgba(52,27,57,0.95)",
					},
				],
			},
		},
		// resultPolyPoints
		traps: {
			id: "traps",
			type: "symbol",
			source: "traps",
			layout: {
				"icon-allow-overlap": true,
				"icon-image": [
					"match",
					["get", "type"],
					"0",
					"unknown",
					"4",
					"general-traffic-control",
					"5",
					"alcohol-control",
					"103",
					"ramp-control",
					"106",
					"pedestrian-crossing",
					["1", "7", "107", "201", "ts"],
					"speed-camera",
					["6", "206"],
					"mobile-distance-speed-camera",
					"20",
					"traffic-jam",
					"21",
					"accident",
					"23",
					"obstacle",
					"24",
					"risk-of-slipping",
					["22", "26"],
					"road-work",
					"25",
					"visual-obstruction",
					"29",
					"breakdown",
					"101",
					"fixed-distance-speed-camera",
					"104",
					"bus-lane",
					"105",
					"icon-traffic-closure",
					["3", "108"],
					"weight-control",
					"109",
					"height-control",
					["2", "110"],
					"combined-fixed",
					["11", "111"],
					"redlight-fixed",
					["12", "112"],
					"section-control-start",
					"113",
					"section-control-end",
					"114",
					"tunnel-speed-camera",
					"115",
					"no-overtaking",
					"2015",
					"mobile-speed-camera-hotspot",
					["vwd", "vwda"],
					"police-report",
					"",
				],
				"icon-size": ["interpolate", ["linear"], ["zoom"], 8, 0.1, 15, 0.15],
				"icon-anchor": "center",
				// ----------- Text ------------
				"text-allow-overlap": true,
				"text-anchor": "center",
				"text-field": [
					"format",
					[
						"match",
						["get", "type"],
						["1", "2", "107", "110", "112", "201", "ts"],
						["get", "vmax", ["get", "trapInfo"]],
						"",
					],
					{
						"text-font": [
							"literal",
							["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
						],
						"text-color": [
							"match",
							["get", "status"],
							"NEW",
							data.symbolTextNewColor || "rgba(123,25,25,0.95)",
							"ESTABLISHED",
							data.symbolTextColor || "rgba(10,34,55,0.95)",
							data.symbolTextColor || "rgba(10,34,55,0.95)",
						],
					},
				],
				"text-offset": [
					"match",
					["get", "type"],
					["2", "110"],
					["literal", [0.2, 0]],
					["1", "107", "112"],
					["literal", [0, 0]],
					["literal", [0, 0]],
				],
				"text-size": ["interpolate", ["linear"], ["zoom"], 8, 11, 15, 16],
			},
			paint: {
				"icon-color": [
					"match",
					["get", "status"],
					"NEW",
					data.symbolNewColor || "rgba(232,10,10,0.7)",
					"ESTABLISHED",
					data.symbolColor || "rgba(13,77,133,0.8)",
					data.symbolColor || "rgba(13,77,133,0.8)",
				],
				"icon-opacity": 1.0,
			},
		},
		// resultPolyLines
		lineBackground: {
			type: "line",
			id: "line-background",
			paint: {
				"line-color": "white",
				"line-width": 6,
				"line-opacity": 0.8,
			},
		},
		lineDashed: {
			type: "line",
			id: "line-dashed",
			paint: {
				"line-color": [
					"match",
					["get", "type"],
					"sc",
					"blue",
					"closure",
					"red",
					"20",
					"green",
					"black",
				],
				"line-width": 6,
				"line-dasharray": [0, 4, 3],
			},
		},
		trafficClosure: {
			type: "symbol",
			id: "traffic-closure",
			filter: ["all", ["==", "type", "closure"]], // filter: ["all", ["==", "type", "20"]]
			layout: {
				"icon-allow-overlap": true,
				"icon-image": "icon-traffic-closure",
				"icon-size": ["interpolate", ["linear"], ["zoom"], 8, 0.04, 15, 0.1],
			},
			paint: {
				"icon-opacity": 1.0,
			},
		},
	};

	return getmapStyles[key];
};

export { getMapStyle };
