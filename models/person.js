const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then( () => {
        console.log('connected to MongoDB')
    })
    .catch( err => {
        console.log('error connecting to MongoDB', err.message)
        })


const numberValidator = (number) => {
    const parts = number.split('-')

    if (parts.every( p => !isNaN(Number(p)))) {
        if (parts.length === 2) {
            return parts[0].length >= 2 && parts[0].length <= 3 && number.length - 1 >= 8
        }
        else if (parts.length === 1) {
            return number.length >= 8
        }
        else return false
    }
    else return false
}
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: [numberValidator, 'min length 8, if separated with one "-" first part length 2-3'],
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)