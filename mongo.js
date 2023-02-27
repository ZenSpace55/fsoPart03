const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]



const url =
  `mongodb+srv://mmadibear:${password}@cluster0.krjvlrc.mongodb.net/phoneBack?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})

// const person = new Person({
//   name: 'Sarah Conor',
//   number: "555-342-7783",
// })

// person.save().then(result => {
//   console.log('person saved!')
//   mongoose.connection.close()
// })