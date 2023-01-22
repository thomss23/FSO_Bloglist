const Blog = require('../models/blog')
const blogRouter = require('express').Router()
const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {

  let blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtrator, async (request, response) => {

  if(!request.body.title || !request.body.url) {
    response.status(400).end()
    return
  }

  const user = request.user

  const blogToBeSaved = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.url,
    user: user._id
  })

  const blog = new Blog(blogToBeSaved)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.userExtrator, async (request,response, next) => {

  try {
    const blog = await Blog.findById(request.params.id)

    if(!blog) {
      return response.status(404).json({ message: 'Blog not found' })
    }

    const user = request.user

    if(blog.user.toString() === user._id.toString()) {
      await Blog.deleteOne({ _id: request.params.id })

      const index = user.blogs.indexOf(request.params.id)
      user.blogs.splice(index, 1)

      await user.save()
    } else {
      return response.status(401).json({ message: 'Unauthorized' })
    }

  } catch(error) {
    next(error)
  }
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const userId = body.user

  const blogObject = {
    author: body.author,
    title : body.title,
    likes : body.likes
  }

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== userId.toString()) {
    return response.status(401).json({ error: 'Not authorized to update this blog' })
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogObject, { new: true })
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter