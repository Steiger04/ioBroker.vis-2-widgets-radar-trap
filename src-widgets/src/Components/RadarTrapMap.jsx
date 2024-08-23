import React, { useCallback, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
// eslint-disable-next-line import/no-unresolved, import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ZoomOutMap from "@mui/icons-material/ZoomOutMap";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { featureCollection } from "@turf/helpers";
import { camelCase } from "lodash";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Map, { Source, Layer, ScaleControl, Popup } from "react-map-gl";
import { getMapStyle } from "../helpers/getMapStyle";
import { useGlobalState } from "../helpers/state";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import { useMapImages } from "../hooks/useMapImages";
import { usePatchOrCreateSourceStatus } from "../hooks/usePatchOrCreateSourceStatus";
import { useRadarTrapSource } from "../hooks/useRadarTrapSource";
import { useResizeMap } from "../hooks/useResizeMap";
import { TrapInfo } from "./TrapInfo";

const RadarTrapMap = ({
	type,
	feathersClient,
	routeOrAreaId,
	settings,
	editMode,
	socket,
	instanceId,
	data,
	style,
	width,
	height,
}) => {
	const [jumpId] = useGlobalState("jumpId");
	const [coordinates] = useGlobalState("coordinates");
	const [trapInfo, setTrapInfo] = useState(false);
	const [cursor, setCursor] = useState("");
	const [filterdedTrapsFeatureCollection, setFilterdedTrapsFeatureCollection] =
		useState(featureCollection([]));
	const theme = useTheme();
	const upSmall =
		// eslint-disable-next-line
		useMediaQuery < theme > ((_theme) => _theme.breakpoints.up("sm"));

	const {
		mapRef,
		loadMapImages,
		status: mapImageStatus,
	} = useMapImages(data.styleSelect);

	const { resizeMap } = useResizeMap({
		_id: routeOrAreaId,
		width,
		height,
		feathersClient,
		map: mapRef,
		animate: false,
	});

	const {
		source: {
			directionsFeatureCollection,
			trapsFeatureCollection,
			polyLinesFeatureCollection,
			areaPolygons,
		},
		sourceStatus,
	} = useRadarTrapSource(routeOrAreaId, feathersClient);

	const patchOrCreateSourceStatus = usePatchOrCreateSourceStatus(
		routeOrAreaId,
		feathersClient,
	);

	useAnimationFrame(
		editMode,
		mapRef,
		mapImageStatus,
		data.closedCongestedRoad,
		data.animateClosedCongestedRoad,
	);

	const mouseEnterHandler = useCallback(() => setCursor("pointer"), []);
	const mouseLeaveHandler = useCallback(() => setCursor(""), []);

	const refreshHander = useCallback(() => {
		socket.setState(
			`${instanceId.split(".").splice(2, 2).join(".")}.${routeOrAreaId}.cron-job.run`,
			{
				val: true,
				ack: false,
			},
		);
	}, [socket, instanceId, routeOrAreaId]);

	const clickHandler = useCallback(
		(event) => {
			const feature = event.features?.[0];

			if (!feature) {
				return;
			}

			// console.log('feature', feature);

			const clusterId = feature.properties?.cluster_id;
			const sourceId = feature.source;
			const mapboxSource = mapRef.current.getSource(sourceId);

			switch (feature.layer.id) {
				case "traffic-closure": {
					const address = JSON.parse(feature.properties.address);

					setTimeout(
						() =>
							setTrapInfo({
								typeText: "Verkehrssperrung",
								country: address.country,
								zipCode: address.zip,
								city: address.city,
								street: address.street,
								longitude: event.lngLat.lng,
								latitude: event.lngLat.lat,
							}),
						0,
					);
					break;
				}

				case "traps":
					setTimeout(
						() =>
							setTrapInfo({
								...JSON.parse(feature.properties.trapInfo),
								longitude: event.lngLat.lng,
								latitude: event.lngLat.lat,
							}),
						0,
					);
					break;

				case "cluster-traps":
					mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
						if (err) {
							return;
						}

						const geometry = feature.geometry;

						mapRef.current.easeTo({
							center: geometry.coordinates,
							zoom,
							duration: 750,
						});
					});
					break;

				default:
					break;
			}
		},
		[mapRef],
	);

	useEffect(() => {
		if (!mapRef.current && !jumpId && !coordinates && !routeOrAreaId) return;

		if (routeOrAreaId === jumpId) {
			mapRef.current?.jumpTo({
				center: coordinates,
				zoom: 15,
			});
		}
	}, [mapRef, jumpId, coordinates, routeOrAreaId]);

	useEffect(() => {
		if (sourceStatus !== "success") return;

		if (!data.visTraps) {
			setFilterdedTrapsFeatureCollection(featureCollection([]));
			return;
		}

		const _filterdedTrapsFeatureCollection = featureCollection(
			trapsFeatureCollection.features.filter((trap) => {
				if (trap.properties) {
					/* if (['7', '11', '12', '201', '206'].includes(trap.properties.type)) {
                    console.log(`PROPERTIES -> ${trap.properties.type}`, trap.properties);
                } */

					const typeDesc = camelCase(trap.properties.type_desc);
					const typeText = camelCase(trap.properties.type_text);

					if (data.onlyNewTraps) {
						if (
							trap.properties.status === "NEW" &&
							data.visTraps[typeDesc][typeText]
						) {
							return true;
						}
					} else if (data.visTraps[typeDesc][typeText]) {
						return true;
					}
				}
				return false;
			}),
		);

		setFilterdedTrapsFeatureCollection(_filterdedTrapsFeatureCollection);

		// console.log('filterdedTrapsFeatureCollection', _filterdedTrapsFeatureCollection);
	}, [trapsFeatureCollection, sourceStatus, data]);

	return settings ? (
		<>
			<Backdrop
				open={patchOrCreateSourceStatus.status === "loading"}
				sx={{
					position: "absolute",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
			>
				<CircularProgress
					size={80}
					sx={{
						color: style["background-color"]
							? style["background-color"]
							: "white",
					}}
				/>
			</Backdrop>
			<Map
				mapboxAccessToken={settings.mbxAccessToken}
				mapLib={mapboxgl}
				ref={loadMapImages}
				reuseMaps
				attributionControl={false}
				logoPosition="bottom-right"
				interactiveLayerIds={["cluster-traps", "traps", "traffic-closure"]}
				cursor={cursor}
				onClick={clickHandler}
				onMouseEnter={mouseEnterHandler}
				onMouseLeave={mouseLeaveHandler}
			>
				{data.refreshButton && routeOrAreaId && (
					<Fab
						sx={{
							position: "absolute",
							left: 0,
							top: 0,
							opacity: 0.7,
							m: 1,
						}}
						size={upSmall ? "medium" : "small"}
						color="primary"
						onClick={refreshHander}
					>
						<AutorenewOutlinedIcon />
					</Fab>
				)}

				{data.fitButton && (
					<Fab
						sx={{
							position: "absolute",
							right: 0,
							top: 0,
							opacity: 0.7,
							m: 1,
						}}
						size={upSmall ? "medium" : "small"}
						color="primary"
						onClick={() => resizeMap(true)}
					>
						<ZoomOutMap />
					</Fab>
				)}

				{trapInfo && (
					<Popup
						maxWidth="auto"
						longitude={trapInfo.longitude}
						latitude={trapInfo.latitude}
						closeButton={false}
						onClose={() => setTrapInfo(false)}
					>
						<TrapInfo info={trapInfo} />
					</Popup>
				)}

				<ScaleControl style={{ p: 4 }} position="bottom-left" />

				{type === "area" &&
					mapImageStatus === "success" &&
					sourceStatus === "success" &&
					data?.showPolygon && (
						<Source
							id="areaPolygons"
							type="geojson"
							data={
								areaPolygons
									? featureCollection(Object.values(areaPolygons)).features[0]
									: featureCollection([])
							}
						>
							<Layer {...getMapStyle("areaSurface", data)} />
							<Layer {...getMapStyle("areaSurfaceBorder", data)} />
						</Source>
					)}

				{type === "route" &&
					mapImageStatus === "success" &&
					sourceStatus === "success" && (
						<Source
							id="directions"
							type="geojson"
							data={directionsFeatureCollection}
						>
							<Layer {...getMapStyle("route", data)} />
						</Source>
					)}

				{mapImageStatus === "success" &&
					sourceStatus === "success" &&
					data.closedCongestedRoad && (
						<Source id="polys" type="geojson" data={polyLinesFeatureCollection}>
							<Layer {...getMapStyle("lineBackground", data)} />
							<Layer {...getMapStyle("lineDashed", data)} />
							<Layer {...getMapStyle("trafficClosure", data)} />
						</Source>
					)}

				{mapImageStatus === "success" &&
					sourceStatus === "success" &&
					!data.showCluster && (
						<Source
							id="traps"
							type="geojson"
							data={filterdedTrapsFeatureCollection}
						>
							<Layer {...getMapStyle("traps", data)} />
						</Source>
					)}

				{mapImageStatus === "success" &&
					sourceStatus === "success" &&
					data.showCluster && (
						<Source
							id="traps"
							type="geojson"
							data={filterdedTrapsFeatureCollection}
							cluster
						>
							<Layer {...getMapStyle("traps", data)} />
							<Layer {...getMapStyle("clusterTraps", data)} />
							<Layer {...getMapStyle("clusterTrapsCount", data)} />
						</Source>
					)}
			</Map>
		</>
	) : null;
};

export { RadarTrapMap };
