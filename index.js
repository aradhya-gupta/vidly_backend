const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

winston.handleExceptions(
    new winston.transports.File({filename: 'uncaughtExceptions.log'})
)
process.on('unhandledRejection', (ex)=>{
   throw ex;
})

winston.add(winston.transports.File, { filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, {db:'mongodb://localhost/vidly', level:'info'});

if (!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log('Connected with mongodb.....'))
    .catch((err) => console.log(err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
//error middleware
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, err => {
    if (err) console.log('Some error occured......');
    else console.log('App listening at port ' + port);
});