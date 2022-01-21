const mongoose = require("mongoose");

const { MONGO_CONNECTION_URL, MONGO_ID, MONGO_PASSWORD, NODE_ENV } =
  process.env;
let MONGO_URL = MONGO_CONNECTION_URL;
if (NODE_ENV === "production") {
  // MONGO_URL = `mongodb+srv://${MONGO_ID}:${MONGO_PASSWORD}@sandbox.papg4.mongodb.net/admin?retryWrites=true&w=majority`;
}

module.exports = () => {
  const connect = () => {
    if (NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }

    // database name
    const config = {
      dbName: "app",
    };

    if (MONGO_ID && MONGO_PASSWORD) {
      config.auth = { authSource: "admin" };
      config.user = MONGO_ID;
      config.pass = MONGO_PASSWORD;
    }

    mongoose.connect(MONGO_URL, config, (error) => {
      if (error) {
        console.log("mongodb connection error", error);
      } else {
        console.log("mongodb connection success");
      }
    });
  };
  connect();

  mongoose.connection.on("error", (error) => {
    console.error("mongodb connection error", error);
    process.exit(1);
  });
  mongoose.connection.on("disconnected", () => {
    console.error("mongodb disconnected, try to connect again");
    connect();
  });

  // require("./user");
  //   require("./room");
};
