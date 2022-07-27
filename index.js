const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


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

const postBody = morgan.token('type', (req, res) => {
    req.body
})

const app = express()

app.use(express.static('build'))
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))
app.use(express.json())
app.use(cors())


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
    if (persons.map(p => p.id).includes(id)) {
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    }
    else {
        response.status(404).end()
    }
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('server running on port ' + PORT)
})