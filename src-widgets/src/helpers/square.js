import destination from "@turf/destination";
import { polygon } from "@turf/helpers";

const square = (center, radius) => {
	const cross = Math.sqrt(2 * radius ** 2);
	const coordinates = [];

	for (let i = 0; i < 4; i++) {
		coordinates.push(
			destination(center, cross, (i * -360) / 4 + 45, {}).geometry.coordinates,
		);
	}
	coordinates.push(coordinates[0]);

	return polygon([coordinates], {});
};

export { square };
