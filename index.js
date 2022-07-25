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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const numberOfPeople = Math.max(...persons.map( p => p.id))
    const timeReceived = Date()
    response.send(
        "<p>Phonebook has info for "+numberOfPeople+" people<p/>" +
        "<p>"+timeReceived+"<p/>"
    )
})

const PORT = 3001
app.listen(PORT)
console.log('server running on port ' + PORT);