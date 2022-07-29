require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

const requestLogger = morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        response.status(400).send({error: 'Malformatted id'})
    }

    next(error)
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())


app.get('/api/persons', (request, response) => {
    Person.find({}).then( data => {
        response.json(data)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then( person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.get('/info', (request, response) => {
    Person.count({}).then( count => {
        response.send(
            "<p>Phonebook has info for "+count+" people<p/>" +
            "<p>"+Date()+"<p/>"
        )
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then( result => {
            if (result) {
                response.status(204).end()
            }
            else {
                response.status(404).end()
            }
        })
        .catch( err => next(err))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === "" || body.number === "") {
        response.status(400).json({ err: 'content missing'})
    }
    else {
        const person = new Person({
            name: body.name,
            number: body.number
        })
        person.save().then( savedPerson => {
            response.json(savedPerson)
        })
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then( updatedPerson => {
            response.json(updatedPerson)
        })
        .catch( err => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('server running on port ' + PORT)
})