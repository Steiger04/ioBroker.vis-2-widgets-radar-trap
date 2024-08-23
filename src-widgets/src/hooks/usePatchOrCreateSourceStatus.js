import { useCallback, useEffect, useState } from "react";

const usePatchOrCreateSourceStatus = (id, feathers) => {
	const [patchOrCreateSourceStatus, setpatchOrCreateSourceStatus] = useState({
		_id: null,
		status: "idle",
	});

	const onStatusListener = useCallback(
		(data) => {
			// console.log("onStatusListener", data);
			if (id === data._id) setpatchOrCreateSourceStatus(data);
		},
		[id],
	);

	useEffect(() => {
		feathers.service("areas").on("status", onStatusListener);
		feathers.service("routes").on("status", onStatusListener);

		return () => {
			feathers.service("areas").removeListener("status", onStatusListener);

			feathers.service("routes").removeListener("status", onStatusListener);
		};
	}, [feathers, onStatusListener]);

	return patchOrCreateSourceStatus;
};

export { usePatchOrCreateSourceStatus };
