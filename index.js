const express = require('express');
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

const timeForRequest = function (request, response, next) {
    request.timeForRequest = new Date();
    next();
};

console.log(timeForRequest);

app.use(timeForRequest);

app.get('/info', (request, response) => {
    const amountOfPersons = persons.length;
    console.log(Date.now());
    response.send(`<p>Phonebook has info for ${amountOfPersons} people</p><p>${request.timeForRequest}</p>`);
})

const PORT = 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);

