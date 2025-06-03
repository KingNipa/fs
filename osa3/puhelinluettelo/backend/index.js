require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose') 
const Person = require('./models/person')
const app = express()

const path = require('path')

const cors = require('cors')


const url = process.env.MONGODB_URI
console.log('yhdistys', url)
mongoose.connect(url)
  .then(() => {
    console.log('yhdistys onnistu mongoo')
  })
  .catch(error => {
    console.error('hemmeti virhe:', error.message)
  })

app.use(express.static(path.join(__dirname, 'build')))
app.use(cors())
//morgan on tehtavaa 3.7:
app.use(express.json())
app.use(morgan('tiny'))

/*

let persons = [
  { name: 'Arto Hellas',       number: '040-123456',      id: 1 },
  { name: 'Ada Lovelace',      number: '39-44-5323523',   id: 2 },
  { name: 'Dan Abramov',       number: '12-43-234345',    id: 3 },
  { name: 'Mary Poppendieck',  number: '39-23-6423122',   id: 4 },
  { name: 'Nipa',              number: '040763',          id: 5 }
] 

//tehtava 3.1:
app.get('/api/persons', (request, response) => {
  console.log('Homma toimii')
  response.json(persons)
})

//Tehtava 3.2:
app.get('/info', (request, response) => {
  const count = persons.length
  const aika = new Date()

  response.send(
    `<div>
       <p>Phonebook has info for ${count} people</p>
       <p>${aika}</p>
     </div>`
  )
})

//Tehtava 3.3:
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } 
})

//Tehtava 3.4:
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

//Tehtava 3.5-3.6:
app.post('/api/persons', (request, response) => {
  const body = request.body

    if (!body.name) {
    return response.status(204).json({ error: 'nimi puuttuu' })
  }
  if (!body.number) {
    return response.status(204).json({ error: 'puhelinnumero puuttuu' })
  }
 
  if (persons.some(p => p.name === body.name)) {
    return response.status(204).json({ error: 'nimen täytyy olla uniikki' })
  }

  const id = Math.floor(Math.random() * 999)
  const newPerson = {
    id: id,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'build', 'index.html'))
}) */

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
//poisto
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// lisätään uus henkilö
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'nimi puuttuu' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'puhelinnumero puuttuu' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})


app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      response.send(
        `<div>
           <p>Phonebook has info for ${count} people</p>
           <p>${new Date()}</p>
         </div>`
      )
    })
})

//Virhetialnteet: 
app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Middleware:
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'no nyt meni mönkää' })
}
app.use(unknownEndpoint)

// middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
   return response.status(400).json({ error: error.message })
 }
  next(error)
}
app.use(errorHandler)


// palvelime käynnistys!
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`servu pyörii: ${PORT}`)
})