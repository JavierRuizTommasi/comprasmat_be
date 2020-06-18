'use strict'
const cors = require('cors');
const authRoutes = require('./auth/auth.routes');
const express = require('express');
const properties = require('./config/properties');
const DB = require('./config/db');
// init DB
DB();

const app = express();

const router = express.Router();

const bodyParser = require('body-parser');
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

app.use(express.static(properties.PUBLIC))
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
app.use(cors());

authRoutes(router,app);

app.use(router);
app.listen(properties.PORT, () => console.log(`Server runing on port ${properties.PORT}`));