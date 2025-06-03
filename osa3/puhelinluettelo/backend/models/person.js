const mongoose = require('mongoose')

//Skeema: 3.19-3.20 päivitykset
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{5,}$/.test(v) //eka muutama numero, väliviiva ja sitten min 5 numeroo
      },
      message: props => `${props.value} puhelinnumero ei ole oikein: 2-3 numeroa, väliviiva ja sitten loput numerot, kiitos )`
    }
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