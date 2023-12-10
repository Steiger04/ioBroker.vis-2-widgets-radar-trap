import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import { camelCase } from "lodash";
import {
    ListSubheader, ListItem, ListItemButton, Typography,
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { i18n as I18n } from "@iobroker/adapter-react-v5";
import { setJumpId, setCoordinates } from "../helpers/state";
import { useRadarTrapSource } from "../hooks/useRadarTrapSource";

const RadarTrapInfoList = ({
    feathersClient, routeOrAreaId, data, style,
}) => {
    const [trapsFeatureGroup, setTrapsFeatureGroup] = useState({});
    const { source: { trapsFeatureCollection }, sourceStatus } = useRadarTrapSource(routeOrAreaId, feathersClient);

    const handleListItemClick = values => {
        setJumpId(values.routeOrAreaId);
        setCoordinates(values.coordinates);
    };

    useEffect(() => {
        if (sourceStatus !== "loading") {
            const trapsFeature = trapsFeatureCollection.features.filter(
                feature => feature.properties.trapInfo !== null,
            );

            const _trapsFeatureGroup = trapsFeature.reduce(
                (groups, trapFeature) => {
                    groups[trapFeature.properties.type_name].push(trapFeature);
                    return groups;
                },
                {
                    "fixed-trap": [],
                    "mobile-trap": [],
                    "speed-trap": [],
                    "road-work": [],
                    "traffic-jam": [],
                    sleekness: [],
                    accident: [],
                    fog: [],
                    object: [],
                    "police-news": [],
                },
            );

            setTrapsFeatureGroup(_trapsFeatureGroup);
        }
    }, [sourceStatus, trapsFeatureCollection]);

    const listItems = Object.entries(trapsFeatureGroup).map(([trapGroupName, trapFeatures], sectionId) => (data[camelCase(trapGroupName)] ?
        <li key={`section-${sectionId}`}>
            { (data.nothingInfo || trapFeatures.length) ?
                <ul style={{ "list-style-position": "inside" }}>
                    <ListSubheader
                        sx={{
                            p: 0,
                            color: "inherit",
                            bgcolor: style["background-color"],
                        }}
                    >
                        <Box
                            sx={{
                                px: 1,
                                display: "flex",
                                alignItems: "center",
                                backdropFilter: "brightness(0.4)",
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        "&.MuiAvatar-rounded": { py: 1 },
                                        filter: `opacity(.5) drop-shadow(0 0 0 ${data.symbolColor})`,
                                        bgcolor: "inherit",
                                        width: 32,
                                        height: 32,
                                    }}
                                    variant="rounded"
                                    src={`widgets/vis-2-widgets-radar-trap/img/icon-${trapGroupName}.png`}
                                />
                            </ListItemAvatar>
                            {data.groupHeadline &&
                            <Typography
                                variant="h6"
                                sx={{ p: 1 }}
                            >
                                { I18n.t(`${trapGroupName}`) }
                            </Typography>}
                        </Box>
                    </ListSubheader>
                    {trapFeatures.map(({ geometry: { coordinates }, properties: { trapInfo } }, itemId) => (
                        <ListItem
                            dense
                            divider
                            key={`item-${sectionId}-${itemId}`}
                        >
                            <ListItemButton
                                onClick={() => handleListItemClick({ routeOrAreaId, coordinates, trapInfo })}
                                sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
                            >
                                {data.trapHeadline &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body1" }}
                                        primary={<b>{trapInfo.typeText}</b>}
                                    />}
                                {trapInfo.vmax &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("vmax") }
                                                :&nbsp;
                                            </b>
                                            <span>
                                                {trapInfo.vmax}
                                                &nbsp;km/h
                                            </span>
                                        </>}
                                    />}
                                {trapInfo.reason &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<Box sx={{ display: "flex", alignItems: "flex-start" }}>
                                            <b>
                                                { I18n.t("reason") }
                                                :&nbsp;
                                            </b>
                                            <span>{trapInfo.reason}</span>
                                        </Box>}
                                    />}
                                {trapInfo.length &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("length") }
                                                :&nbsp;
                                            </b>
                                            <span>
                                                {trapInfo.length}
                                                &nbsp;km
                                            </span>
                                        </>}
                                    />}
                                {trapInfo.duration &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("duration") }
                                                :&nbsp;
                                            </b>
                                            <span>
                                                {trapInfo.duration}
                                                &nbsp;min.
                                            </span>
                                        </>}
                                    />}
                                {trapInfo.delay &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("delay") }
                                                :&nbsp;
                                            </b>
                                            <span>
                                                {trapInfo.delay}
                                                &nbsp;min.
                                            </span>
                                        </>}
                                    />}
                                {trapInfo.createDate &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("createDate") }
                                                :&nbsp;
                                            </b>
                                            <span>{trapInfo.createDate}</span>
                                        </>}
                                    />}
                                {trapInfo.confirmDate &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("confirmDate") }
                                                :&nbsp;
                                            </b>
                                            <span>{trapInfo.confirmDate}</span>
                                        </>}
                                    />}
                                {trapInfo.state &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("state") }
                                                :&nbsp;
                                            </b>
                                            <span>{trapInfo.state}</span>
                                        </>}
                                    />}
                                {trapInfo.street &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("street") }
                                                :&nbsp;
                                            </b>
                                            <span>{trapInfo.street}</span>
                                        </>}
                                    />}
                                {trapInfo.zipCode && trapInfo.city &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("city") }
                                                :&nbsp;
                                            </b>
                                            <span>
                                                {trapInfo.zipCode}
                                                &nbsp;
                                                {trapInfo.city}
                                            </span>
                                        </>}
                                    />}
                                {trapInfo.cityDistrict &&
                                    <ListItemText
                                        sx={{ my: "2px" }}
                                        primaryTypographyProps={{ variant: "body2" }}
                                        primary={<>
                                            <b>
                                                { I18n.t("cityDistrict") }
                                                :&nbsp;
                                            </b>
                                            <span>{trapInfo.cityDistrict}</span>
                                        </>}
                                    />}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </ul> : null}
        </li> : null));

    return (
        <Box sx={{
            overflow: "auto",
            bgcolor: style["background-color"],
            // position: "relative",
            height: "100%",
            width: "100%",
        }}
        >
            <Box
                sx={{
                    "& ul": { padding: 0 },
                }}
            >
                <List
                    sx={{
                        listStylePosition: "inside",
                        backdropFilter: "brightness(0.5)",
                    }}
                    subheader={<li />}
                >
                    {listItems}
                </List>
            </Box>

        </Box>);
};

export { RadarTrapInfoList };
