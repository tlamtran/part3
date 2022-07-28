const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}


const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.gxl4vxp.mongodb.net/firstDatabase?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    mongoose
        .connect(url)
        .then( () => {
            console.log('connected')
        })
        .then( () => {
            Person.find({}).then( result => {
                result.forEach( p => {
                    console.log(`${p.name} ${p.number}`)
                })
                mongoose.connection.close()
            })
        })
        .catch(err => console.log(err))
}

if (process.argv.length > 3 ) {
    mongoose
        .connect(url)
        .then( () => {
            console.log('connected')
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })
            return person.save()
        })
        .then( () => {
            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
            return mongoose.connection.close()
        })
        .catch( err => console.log(err))
}
