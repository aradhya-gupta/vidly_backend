const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Genre, validateGenre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    throw new Error('Could not get genres!');
    const genres = await Genre.find().sort('name');
    res.send(genres);
})

router.get('/:id', async (req, res) => {
    //check if genre with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).send('The genre with given id does not exist!');
        res.send(genre);
    }
    else return res.status(400).send('Invalid Id.');

})

router.post('/', auth, async (req, res) => {
    //validate the input name
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });

    genre = await genre.save();
    res.send(genre);
})

router.put('/:id', auth, async (req, res) => {
    //check if genre with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).send('The genre with given id does not exist!');
        //validate the input name
        const { error } = validateGenre(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //else put new genre 
        genre.name = req.body.name;
        const result = await genre.save();
        res.send(result);
    }
    else return res.status(400).send('Invalid Id.');

})

router.delete('/:id', [auth, admin], async (req, res) => {
    //check if genre with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        if (!genre) return res.status(404).send('The genre with given id does not exist!');
        res.send(genre);
    }
    else return res.status(400).send('Invalid Id.');

})


module.exports = router;