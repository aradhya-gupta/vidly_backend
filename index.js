const express = require('express');
const app = express();
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


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

const port = process.env.PORT || 3000;
app.listen(port, err => {
    if (err) console.log('Some error occured......');
    else console.log('App listening at port ' + port);
});