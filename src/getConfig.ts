const stage = process.env.STAGE;

export default function() {
  switch (stage) {
    case "development":
    default:
      return require("../config/development");
  }
}
