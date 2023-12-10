const makeFederation = require("@iobroker/vis-2-widgets-react-dev/modulefederation.config");

module.exports = makeFederation(
    "vis2RadarTrapWidgets", // internal name of package - must be unique and identical with io-package.json=>common.visWidgets.vis2demoWidget
    {
        "./RadarTrapAreaWidget": "./src/RadarTrapAreaWidget",
        "./RadarTrapRouteWidget": "./src/RadarTrapRouteWidget",
        "./RadarTrapInfoWidget": "./src/RadarTrapInfoWidget",
        "./translations": "./src/translations",
    },
);
