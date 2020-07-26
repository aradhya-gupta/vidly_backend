const express = require('express');
const app = express();
const genres = require('./routes/genres');

app.use(express.json());
app.use('/api/genres', genres);




const port = process.env.PORT || 3000;
app.listen(port, err=>{
    if (err) console.log('Some error occured......');
    else console.log('App listening at port '+port);
});