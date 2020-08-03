const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes.js')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () =>  winston.info('App listening at port ' + port));