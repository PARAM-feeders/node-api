const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const jwtAuthz = require("express-jwt-authz");
require('dotenv').config();
const port = process.env.PORT;
const env = process.env.SERVER_ENV;
const issuerBaseUrl = process.env.ISSUER_BASE_URL;
const CONNECTION_URL = process.env.MDB_URL;

const authorizeAccessToken = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuerBaseUrl}/.well-known/jwks.json`,
  }),
  audience: "node-api",
  issuer: `${issuerBaseUrl}/`,
  algorithms: ["RS256"],
});

const options = { customScopeKey: "permissions" };
const authorizePermission = jwtAuthz(["api:admin"], options);

const app = express();

app.use(helmet());
app.use(cors());

// Public API
app.get("/", (req, res) => {
  res.send({
    version: "0.0.1",
    message: "Hello Client, Server here!",
  });
});

// Protected API
app.get("/protected", authorizeAccessToken, (req, res) => {
  res.send({
    message: "Protected api, authorized only!",
  });
});

// Protected API with Permissions
app.get(
  "/moreprotected",
  authorizeAccessToken,
  authorizePermission,
  (req, res) => {
    res.send({
      message: "Protected api, authorized and has permissions!",
    });
  }
);


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log(`Server Running on Port: http://localhost:${port} in ${env}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);