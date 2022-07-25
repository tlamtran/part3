const { response } = require('express')
const express = require('express')

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

const app = express()

app.use(express.json())

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const maxId = Math.max(...persons.map( p => p.id))
    if (id > maxId || id <= 0) {
        response.status(404).end()
    }
    else {
        response.json(persons[(id - 1)])
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(404).end()
})

app.get('/info', (request, response) => {
    const numberOfPeople = persons.length
    const timeReceived = Date()
    response.send(
        "<p>Phonebook has info for "+numberOfPeople+" people<p/>" +
        "<p>"+timeReceived+"<p/>"
    )
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        response.status(400).json(
            {error: "name missing"}
        )
    }
    else if (!body.number) {
        response.status(400).json(
            {error: "number missing"}
        )
    }
    else if (persons.map(p => p.name).includes(body.name)) {
        response.status(400).json(
            {error: "name already exists"}
        )
    }
    else {
        const randInt = Math.floor(Math.random() * 1000000)
        const person = {id: randInt, ...request.body}
        persons = persons.concat(person)
        response.json(persons)
    }
})

const PORT = 3001
app.listen(PORT)
console.log('server running on port ' + PORT);