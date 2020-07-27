const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: String,
    isGold: { type: Boolean, default: false } ,
    phone: String
})

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        isGold: Joi.boolean().required()
    })

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;