"use strict";
require("process-title");

let server;

process.on("unhandledRejection", error => {
  if (server && typeof server.log === "function") {
    server.log("fatal", error);
  } else {
    // eslint-disable-next-line no-console
    console.error("Programmer error. Process will exit.", error);
  }
  setImmediate(() => {
    process.exit(66); // eslint-disable-line no-process-exit
  }, 1000); // Allow time for log to flush
});

async function main() {
  server = await require("./server").setup();
  await server.start();
  server.log("info", `Server running at: ${server.info.uri}`);
}

main();
