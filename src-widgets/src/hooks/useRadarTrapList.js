import { useFind } from "figbird";

const useRadarTrapList = () => {
    const { data: areaData, status: areaStatus } = useFind(
        "areas",
        {
            realtime: "refetch",
            allPages: true,
            query: { $select: ["_id", "description"] },
        },
    );

    const { data: routesData, status: routesStatus } = useFind(
        "routes",
        {
            realtime: "refetch",
            allPages: true,
            query: { $select: ["_id", "description", "activeProfile"] },
        },
    );

    return {
        areaData, areaStatus, routesData, routesStatus,
    };
};

export { useRadarTrapList };
