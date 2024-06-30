const craco = require("@iobroker/vis-2-widgets-react-dev/craco.config.js");
// const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
    ...craco,    
    reactScriptsVersion: "react-scripts",
    webpack: {            
        mode: "extends",
        configure: (webpackConfig) => {            
            webpackConfig.module.rules.push({
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            });
            webpackConfig.ignoreWarnings = [/Failed to parse source map/];
            return webpackConfig;
        },  
    },
};