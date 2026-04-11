const app = require("./src/app");
const ENV = require("./src/config/config");
const http = require("http");
const connectDB = require("./src/config/Database");
const server = http.createServer(app);

connectDB();
server.listen(ENV.PORT, () => {
  console.log(`Server is running on PORT:${ENV.PORT}`);
});