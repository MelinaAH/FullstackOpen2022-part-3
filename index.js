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

let people = [];

function generateId(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
}

app.get('/api/people', (request, response) => {
    Person.find({}).then(people => {
        console.log(people);
        response.json(people);
    });
});

app.get('/api/people/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.send(`<p>${person.name} tel. ${person.number}</p>`);
        }

        else {
            response.status(404).end();
        }
    });
});

app.post('/api/people', (request, response) => {
    const data = request.body;
    const personExists = people.find(person => person.name === data.name);

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
        const person = new Person({
            id: generateId(997),
            name: data.name,
            number: data.number,
        })

        person.save().then(savedPerson => {
            response.json(savedPerson)
        })
    }
})

morgan.token('body', function getBody(req) {
    return JSON.stringify(req.body);
});

app.delete('/api/people/:id', (request, response) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id, (err) => {
        if (err) {
            response.status(500).json({ error: err.message });
        }

        else {
            people = people.filter(person => person.id != id);
            response.status(204).end();
        }
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
