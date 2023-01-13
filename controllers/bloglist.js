const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const blogRouter = require('express').Router()

blogRouter.get('/', async (request, response) => {
  
  let blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if(!request.body.title || !request.body.url) {
    response.status(400).end();
    return
  }

  const user = await User.findById(request.body.userId)
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request,response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(error) {
    next(error)
  }
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