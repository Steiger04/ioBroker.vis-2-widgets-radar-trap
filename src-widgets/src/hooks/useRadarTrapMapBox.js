import bbox from "@turf/bbox";
import { featureCollection } from "@turf/helpers";
import { useCallback, useEffect, useState } from "react";
import { square } from "../helpers/square";
import { useRadarTrapSource } from "./useRadarTrapSource";

const cache = new Map();

const useRadarTrapMapBox = (id, feathersClient) => {
	const [status, setStatus] = useState("idle");

	const [directionsBox, setDirectionsBox] = useState(null);

	const {
		source: { directionsFeatureCollection, areaPolygons },
		areaSourceStatus,
		routeSourceStatus,
	} = useRadarTrapSource(id, feathersClient);

	const fetchData = useCallback(async () => {
		const url = "http://ip-api.com/json?fields=lon,lat";

		let json;

		setStatus("loading");
		if (cache.has(url)) {
			json = cache.get(url);
		} else {
			json = await fetch(url)
				.then(async (response) => response.json())
				.catch((ex) => {
					setStatus("error");
					console.log(
						`useRadarTrapMapBox() -> fetch(): url=${url} -> Error: ${ex}`,
					);
				});

			cache.set(url, json);
		}

		const coord = Object.values(json);
		const box = bbox(square(coord, 10));

		setDirectionsBox([
			Number(box[1].toFixed(5)),
			Number(box[0].toFixed(5)),
			Number(box[3].toFixed(5)),
			Number(box[2].toFixed(5)),
		]);

		setStatus("success");
	}, []);

	useEffect(() => {
		if (areaSourceStatus === "error" && routeSourceStatus === "error") {
			fetchData().catch((ex) => {
				setStatus("error");
				console.log(`useRadarTrapMapBox() -> fetchData() -> Error: ${ex}`);
			});
		}
	}, [areaSourceStatus, routeSourceStatus, fetchData]);

	useEffect(() => {
		if (!areaPolygons) return;

		if (areaSourceStatus === "success") {
			setDirectionsBox(bbox(featureCollection(Object.values(areaPolygons))));
			setStatus("success");

			return;
		}

		if (areaSourceStatus === "loading") {
			setStatus("loading");
		}
	}, [areaSourceStatus, areaPolygons]);

	useEffect(() => {
		if (!directionsFeatureCollection.features.length) return;

		if (routeSourceStatus === "success") {
			setDirectionsBox(bbox(directionsFeatureCollection));
			setStatus("success");

			return;
		}

		if (routeSourceStatus === "loading") {
			setStatus("loading");
		}
	}, [routeSourceStatus, directionsFeatureCollection]);

	return { status, directionsBox };
};

export { useRadarTrapMapBox };
