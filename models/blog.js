const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: {
    type:Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Blog = mongoose.model('Blog', blogSchema)

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = Blog
// {
//   "title": "new title",
//   "author": "new author",
//   "url": "new url",
//   "likes": 4

// }

// {
//   "blogs": [],
//   "username": "testuser2",
//   "name": "nametest2",
//   "id": "63c16f3088b1d84224171de4"
// },

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI2M2MxYjYwNmViYjA2ZTRkNjE0ZTliNzMiLCJpYXQiOjE2NzM2Mzk0NDAsImV4cCI6MTY3MzY0MzA0MH0.euuYpWTlM55zprN8ExnpSs47f92A1DtIXRVQhW7vcTU