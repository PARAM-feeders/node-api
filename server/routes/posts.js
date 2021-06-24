var express = require('express');
const router = express.Router();
const ctrl = require('../controllers/post')
const issuerBaseUrl = process.env.ISSUER_BASE_URL;
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const jwtAuthz = require("express-jwt-authz");

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

// console.log("authorizeAccessToken", authorizeAccessToken, authorizePermission);

router
  .get('/posts',authorizeAccessToken, ctrl.getAllPosts) // get all posts
  .post('/posts', ctrl.createPost)  // create posts


router
  .get('/post/:id', ctrl.getSinglePost) // get single post
  .put('/post/:id', ctrl.updatePost) // update posy
  .delete('/post/:id', ctrl.deletePost)  // delete posts



module.exports = router