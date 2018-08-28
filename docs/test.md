## TO TEST THE CODE

From node-backend-test root directory, run the following commands:
* mongod (in a separate tab/terminal)
* npm run test-rest-server
* Optionally, delete the 'x' on line 23 of /rest-server/test/mapbox.js and paste a valid API key in /rest-server/src/components/mapbox/mapboxControllers.js to enable mapbox external API feature test