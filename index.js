require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
const mongoose = require('mongoose')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [

]

app.get('/', (request, response) => {
response.send('<h1>Phonebook Backend!</h1>')
})

app.get('/api/info', (request, response) => {
  var currentDate = new Date();
  response.send(`<p>Phonebook has info for ${persons.length} people.</p>`+
  `<p>${currentDate.toUTCString()}</p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(perons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      if (person){
      response.json(person)
      }
      else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {

const body = request.body
if (!body.name){
    return response.status(400).json({error: "name missing"})
}
if (!body.number){
  return response.status(400).json({error: "number missing, each person requires a phone number"})
}
if (persons.find(person => person.name == body.name)){
  return response.status(400).json({error: "name already exists in book, names must be unique"})
}
const person = new Person({
    name: body.name,
    number: body.number,
})
person.save().then(savedPerson => {
  response.json(savedPerson)
})

persons = persons.concat(person)
//console.log(person)
//response.json(person)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
