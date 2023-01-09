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

blogRouter.delete('/:id', async (request,response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    author: body.author,
    title : body.title,
    likes : body.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
  
})

module.exports = blogRouter