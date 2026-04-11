const ImageKit = require("imagekit");
const ENV = require("../config/config");

const imagekit = new ImageKit({
  publicKey: ENV.IMAGEKIT_PUBLIC_KEY,
  privateKey: ENV.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: ENV.IMAGEKIT_URL_ENDPOINT
});

module.exports = imagekit;