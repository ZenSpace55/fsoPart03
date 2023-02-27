const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

if (process.argv.length == 5){
  const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  })

  person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
  })
}
else{
  Person.find({}).then(result => {
      result.forEach(note => {
      console.log(note)
      })
      mongoose.connection.close()
  })
}


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
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if (person){
        console.log(person)
        response.json(person)
    }
    else{
        response.statusMessage = "Person not found..."
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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
const person = {
    id: Math.floor(Math.random() * 9999999),
    name: body.name,
    number: body.number,
}

persons = persons.concat(person)
console.log(person)
response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)