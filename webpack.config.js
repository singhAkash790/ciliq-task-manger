const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util"),
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory for compiled files
    filename: "bundle.js", // Name of the output bundle
  },
  // other configurations...
  devServer: {
    contentBase: path.join(__dirname, "dist"), // Serve files from the 'dist' directory
    compress: true,
    port: 3001, // Port number for the development server
  },
};
