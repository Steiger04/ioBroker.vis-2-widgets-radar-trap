import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
	jumpId: "",
	coordinates: [],
});

const setJumpId = (jumpId) => setGlobalState("jumpId", jumpId);
const setCoordinates = (coordinates) =>
	setGlobalState("coordinates", coordinates);

export { setJumpId, setCoordinates, useGlobalState };
