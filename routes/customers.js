const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { Customer, validateCustomer } = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
})

router.get('/:id', async (req, res) => {
    //check if genre with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).send('The customer with given id does not exist!');
        res.send(customer);
    }
    else return res.status(400).send('Invalid Id.');

})
router.post('/', auth, async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    })

    customer = await customer.save();
    res.send(customer);
})

router.put('/:id', auth, async (req, res) => {
    //check if genre with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).send('The customer with given id does not exist!');
        //validate the input name
        const { error } = validateCustomer(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //else put new genre 
        customer.name = req.body.name;
        const result = await customer.save();
        res.send(result);
    }
    else return res.status(400).send('Invalid Id.');

})

router.delete('/:id', auth, async (req, res) => {
    //check if genre with given id exists
    if (mongoose.isValidObjectId(req.params.id)) {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        if (!customer) return res.status(404).send('The customer with given id does not exist!');
        res.send(customer);
    }
    else return res.status(400).send('Invalid Id.');

})
module.exports = router;
