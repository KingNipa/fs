const express = require('express')
const morgan = require('morgan')
const app = express()

//morgan on tehtavaa 3.7:
app.use(express.json())
app.use(morgan('tiny'))

const persons = [
  { name: 'Arto Hellas',       number: '040-123456',      id: 1 },
  { name: 'Ada Lovelace',      number: '39-44-5323523',   id: 2 },
  { name: 'Dan Abramov',       number: '12-43-234345',    id: 3 },
  { name: 'Mary Poppendieck',  number: '39-23-6423122',   id: 4 },
  { name: 'Nipa',              number: '040763',          id: 5 }
]

//tehtava 3.1:
app.get('/api/persons', (req, res) => {
  console.log('Homma toimii')
  res.json(persons)
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

  const id = Math.floor(Math.random() * max)
  const newPerson = {
    id: id,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})


// 3.9
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})