const express = require('express');
const router = express.Router();
const Joi = require('joi');

const genres = [
    {id:1, name:"Action"},
    {id:2, name:"Horror"},
    {id:3, name:"Comedy"}
]

router.get('/', (req, res)=>{
    res.send(genres);
})

router.get('/:id', (req, res)=>{
    //check if genre with given id exists
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with given id does not exist!');

    res.send(genre);
})

router.post('/', (req, res)=>{
    //validate the input name
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send('The genre name is not valid!');

    const genre = {
        id: genres.length +1,
        name: req.body.name,
    }

    genres.push(genre);
    res.send(genre);
})

router.put('/:id', (req, res)=>{
     //check if genre with given id exists
     const genre = genres.find(g => g.id === parseInt(req.params.id));
     if(!genre) return res.status(404).send('The genre with given id does not exist!');
 
     //validate the input name
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send('The genre name is not valid!');
    
    //else put new genre 
    genre.name = req.body.name;
    res.send(genre);
})

router.delete('/:id', (req, res)=>{
    //check if genre with given id exists
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with given id does not exist!');

    //if exists then delete
    genres.splice(genres.indexOf(genre), 1);
    res.send(genre);
})


function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().required(),
    })
    return schema.validate(genre);
}

module.exports =  router;