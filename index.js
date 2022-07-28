require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()


// middleware
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
    Person.find({}).then( data => {
        response.json(data)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then( person => {
        response.json(person)
    })
})

app.get('/info', (request, response) => {
    const numberOfPeople = persons.length
    const timeReceived = Date()
    response.send(
        "<p>Phonebook has info for "+numberOfPeople+" people<p/>" +
        "<p>"+timeReceived+"<p/>"
    )
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

app.post('/api/persons', (request, response) => {
    const body = request.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then( savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('server running on port ' + PORT)
})