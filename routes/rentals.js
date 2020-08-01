const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const auth = require('../middleware/auth');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
})

router.get('/:id', async (req, res) => {
    //check if genre with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        const movie = await Rental.findById(req.params.id);
        if (!movie) return res.status(404).send('The movie with given id does not exist!');
        res.send(movie);
    }
    else return res.status(400).send('Invalid Id.');

})

router.post('/', auth, async (req, res) => {
    //validate the input name
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer!");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie!");

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in Stock!');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    }
    catch (ex) {
        res.status(500).send('Something failed!');
    }
});



module.exports = router;