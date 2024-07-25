"use strict";
const express = require("express");
const app = express();
const helmet = require("helmet");

//  Hide framework name from requests
app.use(helmet.hidePoweredBy());
// Prevent iframe hijacking
app.use(helmet.frameguard({ action: "deny" }));
// Sanitize user input
app.use(helmet.xssFilter());
// Prevent MIME hijack attacks
app.use(helmet.noSniff());
// Outright block Internet Explorer
app.use(helmet.ieNoOpen());
// Enforce HTTPS for 90 days
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;
const timeInSeconds = ninetyDaysInSeconds;
app.use(helmet.hsts({ maxAge: timeInSeconds, force: true }));
// dns safeguard
app.use(helmet.dnsPrefetchControl());
// disable cache: use with intention and caution
app.use(helmet.noCache());
// CSP config
const directivesConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "trusted-cdn.com"],
  },
};
app.use(helmet.contentSecurityPolicy(directivesConfig));

/**
 * app.use(helmet({
  frameguard: {         // configure
    action: 'deny'
  },
  contentSecurityPolicy: {    // enable and configure
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ['style.com'],
    }
  },
  dnsPrefetchControl: false     // disable
}))
 * Is equivalent to all the prior configurations with the exception of cache and CSP
 * which must be configured individually.
 */

module.exports = app;
const api = require("./server.js");
app.use(express.static("public"));
app.disable("strict-transport-security");
app.use("/_api", api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
