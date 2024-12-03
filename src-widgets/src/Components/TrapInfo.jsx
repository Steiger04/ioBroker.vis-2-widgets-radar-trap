import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import Generic from "../Generic";

const TrapInfo = ({ info }) => {
	let vmax;

	if (!isEmpty(info.vmax)) {
		switch (info.vmax) {
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
				vmax = `${info.vmax} km/h`;
		}
	} else {
		vmax = false;
	}

	return (
		<Box
			sx={{
				margin: "-10px -10px -15px -10px",
				p: 0,
				minWidth: 200,
				maxWidth: 300,
			}}
		>
			<Card variant="elevation" elevation={6}>
				<Box sx={{ bgcolor: "primary.main", px: 1, borderBottom: 2 }}>
					{info.typeDesc && (
						<Typography align="center" variant="h6">
							{Generic.t(info.typeDesc)}
						</Typography>
					)}
				</Box>
				<CardContent sx={{ mt: -1, mb: -2 }}>
					{info.typeText && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("kind")}: `}</b>
							{Generic.t(info.typeText)}
						</Typography>
					)}
					{vmax && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("maximum speed")}: `}</b>
							{vmax}
						</Typography>
					)}
					{info.reason && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("reason")}: `}</b>
							{info.reason}
						</Typography>
					)}
					{info.length && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("jam length")}: `}</b>
							{`${info.length} km`}
						</Typography>
					)}
					{info.duration && info.duration !== 0 && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("duration")}: `}</b>
							{`${info.duration} min.`}
						</Typography>
					)}
					{info.delay && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("delay")}: `}</b>
							{`${info.delay} min.`}
						</Typography>
					)}
					{info.createDate && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("reported")}: `}</b>
							{info.createDate}
						</Typography>
					)}
					{info.confirmDate && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("confirmed")}: `}</b>
							{info.confirmDate}
						</Typography>
					)}
					{info.typeText !== "Verkehrssperrung" && <Divider />}
					{info.state && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("state")}: `}</b>
							{info.state}
						</Typography>
					)}
					{info.street && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("street")}: `}</b>
							{info.street}
						</Typography>
					)}
					{info.zipCode && info.city && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("city")}: `}</b>
							{info.zipCode} {info.city}
						</Typography>
					)}
					{info.cityDistrict && (
						<Typography variant="subtitle2">
							<b>{`${Generic.t("cityDistrict")}: `}</b>
							{info.cityDistrict}
						</Typography>
					)}
				</CardContent>
			</Card>
		</Box>
	);
};

export { TrapInfo };
