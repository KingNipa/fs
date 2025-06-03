const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://Nipa:MongoSala99!@cluster0.qys71et.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


mongoose.connect(uri)
  .then(() => {
    if (process.argv.length === 3) {
      const personSchema = new mongoose.Schema({
        name: String,
        number: String
      })
      const Person = mongoose.model('Person', personSchema)

      Person.find({})
        .then(persons => {
          console.log('phonebook:')
          persons.forEach(p => {
            console.log(`${p.name} ${p.number}`)
          })
          return mongoose.connection.close()
        })
        .catch(error => {
          console.error(error)
          mongoose.connection.close()
        })
    }
    else if (process.argv.length === 5) {
      const name = process.argv[3]
      const number = process.argv[4]

      const personSchema = new mongoose.Schema({
        name: String,
        number: String
      })
      const Person = mongoose.model('Person', personSchema)

      const newPerson = new Person({
        name: name,
        number: number
      })

      newPerson.save()
        .then(savedPerson => {
          console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
          return mongoose.connection.close()
        })
        .catch(error => {
          console.error(error)
          mongoose.connection.close()
        })
    }
    else {
      mongoose.connection.close()
    }
  })
  .catch(error => {
    console.error('error Mongo:', error.message)
  })