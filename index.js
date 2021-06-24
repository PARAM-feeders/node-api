const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require('dotenv').config();
const port = process.env.PORT;
const env = process.env.SERVER_ENV;
require('./server/models/db');


const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

var indexRouter = require('./server/routes/posts')
app.use('/', indexRouter);



app.listen(port, () => console.log(`Server Running on Port: http://localhost:${port} in ${env}`));