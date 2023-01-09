const Blog = require('../models/blog')
const blogRouter = require('express').Router()

blogRouter.get('/', async (request, response) => {
  
  let blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if(!request.body.title || !request.body.url) {
    response.status(400).end();
    return
  }

  const blog = new Blog(request.body)

  let result = await blog.save();
  response.status(201).json(result)
})

module.exports = blogRouter