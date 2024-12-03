import {
	ListItem,
	ListItemButton,
	ListSubheader,
	Typography,
	darken,
	lighten,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { camelCase, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import Generic from "../Generic";
import { setCoordinates, setJumpId } from "../helpers/state";
import { useRadarTrapSource } from "../hooks/useRadarTrapSource";

import IconDangerSpot from "../assets/map-icons/icon-danger-spot-sdf.png";
import IconMobileSpeedCameraHotspot from "../assets/map-icons/icon-mobile-speed-camera-hotspot-2015-sdf.png";
import IconPoliceReport from "../assets/map-icons/icon-police-report-vwd-vwda-sdf.png";
import IconConstructionSite from "../assets/map-icons/icon-road-work-22-26-sdf.png";
import IconSpeedCamera from "../assets/map-icons/icon-speed-camera-sdf.png";
import IconTrafficJamEnd from "../assets/map-icons/icon-traffic-jam-20-sdf.png";

const images = {
	constructionSite: IconConstructionSite,
	trafficJamEnd: IconTrafficJamEnd,
	dangerSpot: IconDangerSpot,
	fixedSpeedCamera: IconSpeedCamera,
	semiStationarySpeedCamera: IconSpeedCamera,
	mobileSpeedCamera: IconSpeedCamera,
	mobileSpeedCameraHotspot: IconMobileSpeedCameraHotspot,
	policeReport: IconPoliceReport,
	policeReportArchive: IconPoliceReport,
};

const RadarTrapInfoList = ({ feathersClient, routeOrAreaId, data, style }) => {
	const [trapsFeatureGroup, setTrapsFeatureGroup] = useState({});
	const {
		source: { trapsFeatureCollection },
		sourceStatus,
	} = useRadarTrapSource(routeOrAreaId, feathersClient);

	const handleListItemClick = (values) => {
		setJumpId(values.routeOrAreaId);
		setCoordinates(values.coordinates);
	};

	useEffect(() => {
		if (sourceStatus !== "success") return;

		const _filterdedTrapsFeature = trapsFeatureCollection.features.filter(
			(trap) => {
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
			},
		);

		const _trapsFeatureGroup = _filterdedTrapsFeature.reduce(
			(groups, trapFeature) => {
				groups[trapFeature.properties.type_desc].push(trapFeature);
				return groups;
			},
			{
				"construction site": [],
				"traffic jam end": [],
				"danger spot": [],
				"fixed speed camera": [],
				"semi-stationary speed camera": [],
				"mobile speed camera": [],
				"mobile speed camera hotspot": [],
				"police report": [],
				"police report, archive": [],
			},
		);

		setTrapsFeatureGroup(_trapsFeatureGroup);
	}, [sourceStatus, trapsFeatureCollection, data.visTraps, data.onlyNewTraps]);

	const listItems = Object.entries(trapsFeatureGroup)
		.map(([trapGroupName, trapFeatures]) => [
			trapGroupName,
			trapFeatures.filter((feature) =>
				!data.onlyNewTraps
					? true
					: feature.properties.trapInfo.status === "NEW",
			),
		])
		.map(([trapGroupName, trapFeatures], sectionId) =>
			data.visTraps[camelCase(trapGroupName)] ? (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<li key={`section-${sectionId}`}>
					{data.nothingInfo || trapFeatures.length ? (
						<ul style={{ "list-style-position": "inside" }}>
							<ListSubheader
								sx={{
									display: "flex",
									justifyContent: "space-around",
									alignItems: "center",
									bgcolor: style["background-color"]
										? lighten(style["background-color"], 0.15)
										: null,
									color: style?.color ? style.color : null,
								}}
							>
								<ListItemAvatar
									sx={{
										flexGrow:
											!style["text-align"] || style["text-align"] === "left"
												? 0
												: 1,
										display: "flex",
										justifyContent:
											!style["text-align"] || style["text-align"] === "left"
												? "left"
												: "right",
									}}
								>
									<Avatar
										slotProps={{
											img: {
												style: {
													filter: `drop-shadow(0px 1000px 0 ${data.symbolColor})`,
													transform: "translateY(-1000px)",
												},
											},
										}}
										sx={{
											// '&.MuiAvatar-rounded': { py: 1 },
											width: 32,
											height: 32,
										}}
										variant="rounded"
										src={images[camelCase(trapGroupName)]}
									/>
								</ListItemAvatar>
								{data.groupHeadline && (
									<Typography
										variant="h6"
										component="h6"
										sx={{
											ml:
												style["text-align"] === "right" ||
												style["text-align"] === "center"
													? 2
													: -1,
											p: 1,
											flexGrow: style["text-align"] === "right" ? 0 : 1,
											textAlign: "left",
											fontFamily: style["font-family"],
											fontWeight: style["font-weight"],
											fontSize: style["font-size"],
											lineHeight: style["line-height"],
											letterSpacing: style["letter-spacing"],
											wordSpacing: style["word-spacing"],
										}}
									>
										<b>{Generic.t(`${trapGroupName}`)}</b>
									</Typography>
								)}
							</ListSubheader>
							{trapFeatures.map(
								(
									{ geometry: { coordinates }, properties: { trapInfo } },
									itemId,
								) => {
									let vmax;

									if (!isEmpty(trapInfo.vmax)) {
										switch (trapInfo.vmax) {
											case "V":
												vmax = Generic.t("unknown");
												break;
											case "v":
												vmax = Generic.t("unknown");
												break;
											case "/":
												vmax = false;
												break;
											case false:
												vmax = false;
												break;
											default:
												vmax = `${trapInfo.vmax} km/h`;
										}
									} else {
										vmax = false;
									}

									return (
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										<ListItem dense divider key={`item-${sectionId}-${itemId}`}>
											<ListItemButton
												onClick={() =>
													handleListItemClick({
														routeOrAreaId,
														coordinates,
														trapInfo,
													})
												}
												sx={{
													display: "flex",
													justifyContent: style["text-align"],
												}}
											>
												<Box
													sx={{
														display: "flex",
														flexDirection: "column",
													}}
												>
													{data.trapHeadline && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body1",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={<b>{Generic.t(trapInfo.typeText)}</b>}
														/>
													)}
													{vmax && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("vmax")}
																		:&nbsp;
																	</b>
																	<span>{vmax}</span>
																</>
															}
														/>
													)}
													{trapInfo.reason && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<Box
																	sx={{
																		display: "flex",
																		alignItems: "flex-start",
																	}}
																>
																	<b>
																		{Generic.t("reason")}
																		:&nbsp;
																	</b>
																	<span>{trapInfo.reason}</span>
																</Box>
															}
														/>
													)}
													{trapInfo.length && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("length")}
																		:&nbsp;
																	</b>
																	<span>
																		{trapInfo.length}
																		&nbsp;km
																	</span>
																</>
															}
														/>
													)}
													{trapInfo.duration && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("duration")}
																		:&nbsp;
																	</b>
																	<span>
																		{trapInfo.duration}
																		&nbsp;min.
																	</span>
																</>
															}
														/>
													)}
													{trapInfo.delay && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("delay")}
																		:&nbsp;
																	</b>
																	<span>
																		{trapInfo.delay}
																		&nbsp;min.
																	</span>
																</>
															}
														/>
													)}
													{trapInfo.createDate && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("createDate")}
																		:&nbsp;
																	</b>
																	<span>{trapInfo.createDate}</span>
																</>
															}
														/>
													)}
													{trapInfo.confirmDate && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("confirmDate")}
																		:&nbsp;
																	</b>
																	<span>{trapInfo.confirmDate}</span>
																</>
															}
														/>
													)}
													{trapInfo.state && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("state")}
																		:&nbsp;
																	</b>
																	<span>{trapInfo.state}</span>
																</>
															}
														/>
													)}
													{trapInfo.street && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("street")}
																		:&nbsp;
																	</b>
																	<span>{trapInfo.street}</span>
																</>
															}
														/>
													)}
													{trapInfo.zipCode && trapInfo.city && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("city")}
																		:&nbsp;
																	</b>
																	<span>
																		{trapInfo.zipCode}
																		&nbsp;
																		{trapInfo.city}
																	</span>
																</>
															}
														/>
													)}
													{trapInfo.cityDistrict && (
														<ListItemText
															sx={{ my: "2px" }}
															primaryTypographyProps={{
																variant: "body2",
																fontFamily: style["font-family"],
																fontWeight: style["font-weight"],
																fontSize: style["font-size"],
																letterSpacing: style["letter-spacing"],
																wordSpacing: style["word-spacing"],
															}}
															primary={
																<>
																	<b>
																		{Generic.t("cityDistrict")}
																		:&nbsp;
																	</b>
																	<span>{trapInfo.cityDistrict}</span>
																</>
															}
														/>
													)}
												</Box>
											</ListItemButton>
										</ListItem>
									);
								},
							)}
						</ul>
					) : null}
				</li>
			) : null,
		);

	return (
		<Box
			sx={{
				overflow: "auto",
				height: "100%",
				width: "100%",
				position: "relative",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					width: "100%",
					height: "100%",
					"& ul": { padding: 0 },
				}}
			>
				<List
					sx={{
						listStylePosition: "inside",
						bgcolor: style["background-color"]
							? darken(style["background-color"], 0.2)
							: null,
					}}
					subheader={<li />}
				>
					{listItems}
				</List>
			</Box>
		</Box>
	);
};

export { RadarTrapInfoList };
