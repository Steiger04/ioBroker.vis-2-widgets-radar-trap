const craco = require("@iobroker/vis-2-widgets-react-dev/craco.config.js");

module.exports = {
	...craco,
	webpack: {
		mode: "extends",
		configure: (webpackConfig) => {
			webpackConfig.ignoreWarnings = [/Failed to parse source map/];
			return webpackConfig;
		},
		devServer: {
			setupMiddlewares: (middlewares, devServer) => {
				if (fs.existsSync(paths.proxySetup)) {
					require(paths.proxySetup)(devServer.app);
				}

				middlewares.push(
					evalSourceMapMiddleware(devServer),
					redirectServedPath(paths.publicUrlOrPath),
					noopServiceWorkerMiddleware(paths.publicUrlOrPath),
				);

				return middlewares;
			},
		},
	},
	devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
		devServerConfig.onBeforeSetupMiddleware = undefined;
		devServerConfig.onAfterSetupMiddleware = undefined;
		return devServerConfig;
	},
};
