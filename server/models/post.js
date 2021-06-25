const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  name: String,
  description: String,
  image:String,
  location:String
})

module.exports = mongoose.model('Post', postSchema)