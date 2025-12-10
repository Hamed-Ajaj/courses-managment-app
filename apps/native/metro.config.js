// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = withNativeWind(getDefaultConfig(__dirname), {
	input: "./global.css",
	configPath: "./tailwind.config.js",
});
// Add wasm asset support
config.resolver.assetExts.push('wasm');

// Add COEP and COOP headers to support SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
