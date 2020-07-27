const express = require('express');
const app = express();
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Connected with mongodb.....'))
    .catch((err) => console.log(err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers)

const port = process.env.PORT || 3000;
app.listen(port, err => {
    if (err) console.log('Some error occured......');
    else console.log('App listening at port ' + port);
});