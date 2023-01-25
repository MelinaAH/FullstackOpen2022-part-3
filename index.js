const express = require('express');
const morgan = require('morgan');

const app = express();

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
]

app.use(express.json());
app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

function generateId(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
}

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.send(`<p>${person.name} tel. ${person.number}</p>`);
    }

    else {
        response.status(404).end();
    }
})

app.post('/api/persons', (request, response) => {
    const data = request.body;
    const personExists = persons.find(person => person.name === data.name);
    
    console.log(`Data.name ${data.name}`);
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

        morgan.token('body', function getBody(req) {
            return JSON.stringify(req.body);
        });
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id != id);

    response.status(204).end();
})

const PORT = 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
