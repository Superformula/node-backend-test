const stage = process.env.STAGE;

export default function() {
  switch (stage) {
    case "development":
    default:
      const config = require("../config/development");
      return config;
  }
}
