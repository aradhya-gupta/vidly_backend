const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
})

router.get('/:id', async (req, res) => {
    //check if genre with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('The movie with given id does not exist!');
        res.send(movie);
    }
    else return res.status(400).send('Invalid Id.');

})

router.post('/', auth, async (req, res) => {
    //validate the input name
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid Genre!");

    const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });

    await movie.save();
    res.send(movie);
})

router.put('/:id', auth, async (req, res) => {
    //check if movie with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        let movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send('The movie with given id does not exist!');
        //validate the input name
        const { error } = validateMovie(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //else put new movie
        movie.title = req.body.title;
        movie.numberInStock = req.body.numberInStock;
        movie.dailyRentalRate = req.body.dailyRentalRate;
        const result = await movie.save();
        res.send(result);
    }
    else return res.status(400).send('Invalid Id.');

})

router.delete('/:id', auth, async (req, res) => {
    //check if genre with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        if (!movie) return res.status(404).send('The movie with given id does not exist!');
        res.send(movie);
    }
    else return res.status(400).send('Invalid Id.');

})


module.exports = router;