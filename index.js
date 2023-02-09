const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

app.use(cors());
app.use(express.json());
//app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('build'));

let persons = [];

function generateId(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        console.log(persons);
        response.json(persons);
    });
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.send(`<p>${person.name} tel. ${person.number}</p>`);
    }

    else {
        response.status(404).end();
    }
}),

app.post('/api/persons', (request, response) => {
    const data = request.body;
    const personExists = persons.find(person => person.name === data.name);
    
    console.log(data, typeof data);
    console.log(`Data variable ${data.name}`);
    //console.log(`Person ${personExists.name} is already added`);

    if (!data.name) {
        return response.status(400).json({ error: 'Name field cannot be empty' });
    }

    else if (!data.number) {
        return response.status(400).json({ error: 'Number field cannot be empty' });
    }

    else if (personExists) {
        return response.status(400).json({ error: 'Name must be unique' });
    }

    else {
        const person = {
            id: generateId(997),
            name: data.name,
            number: data.number,
        }
    
        persons = persons.concat(person);
    
        response.json(person);
    }
})

morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id != id);

    response.status(204).end();
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
