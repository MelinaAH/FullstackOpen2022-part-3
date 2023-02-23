const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  else if (error.name === 'ValidationError') {
    //return response.status(400).json({ error: 'Name field and/or number field cannot be empty' });
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
//app.use(morgan('tiny'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

function generateId(maxNumber) {
  return Math.floor(Math.random() * maxNumber);
}

app.get('/api/people', (request, response, next) => {
  Person.find({})
    .then(people => {
      console.log(people);
      response.json(people);
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        //response.send(`<p>${person.name} tel. ${person.number}</p>`);
        response.json(person);
      }

      else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

app.post('/api/people', (request, response, next) => {
  const data = request.body;

  console.log(data, typeof data);
  console.log(`The name to be added ${data.name}`);

  const person = new Person({
    id: generateId(997),
    name: data.name,
    number: data.number,
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body);
});

app.put('/api/people/:id', (request, response, next) => {
  const { id, name, number } = request.body;

  Person.findByIdAndUpdate(request.params.id,
    { id, name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

app.delete('/api/people/:id', (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
