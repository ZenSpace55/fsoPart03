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

if (process.argv.length == 5){
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    })

    person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
    })
}
else{
    Person.find({}).then(result => {
        result.forEach(note => {
        console.log(note)
        })
        mongoose.connection.close()
    })
}
// const person = new Person({
//   name: 'Sarah Conor',
//   number: "555-342-7783",
// })

// person.save().then(result => {
//   console.log('person saved!')
//   mongoose.connection.close()
// })