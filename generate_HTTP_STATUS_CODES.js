
/*
	node generate_HTTP_STATUS_CODES.js >> http_statuscodes.json
*/

const http = require("http")

console.log( JSON.stringify(http.STATUS_CODES) )