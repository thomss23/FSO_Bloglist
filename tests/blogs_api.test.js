const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/blogs_helper')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const api = supertest(app)

//TODO: Write more tests to cover other cases

describe('GET /api/blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogs = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are 2 blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(2)
  })

  test('there id field is defined when retrieving blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

const mockUser = async () => {

  const user = new User({
    name: 'abcd',
    username: 'abcd',
    passwordHash: '$2y$10$A66Lt.yVKJECoXxB9bMES.NGS2CzpI2wt4vQz/JsowsD8QmyDpMMq',
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id
  }

  return userForToken
}

describe('POST /api/blogs', () => {
  let token
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const userForToken = await mockUser()
    token = jwt.sign(userForToken, 'secret', { expiresIn: 60*60 })

    helper.initialBlogs.forEach(blog => blog.user = userForToken.id)

    const blogs = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('should fail with 401 when a token is not sent', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('if a blog is added without the likes property, it should default to 0', async () => {
    const newBlogWithoutLikes = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    let lastAddedBlog = response.body.find(blog => blog.title === 'React patterns')
    expect(lastAddedBlog.likes).toBe(0)
  })

  test('if a blog is added without the title property, it should return 400', async () => {
    const newBlogWithoutLikes = {
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutLikes)
      .expect(400)
  })
})

describe('DELETE /api/blogs/id', () => {

  let token
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const userForToken = await mockUser()
    token = jwt.sign(userForToken, 'secret', { expiresIn: 60*60 })

    helper.initialBlogs.forEach(blog => blog.user = userForToken.id)

    const blogs = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('should fail with 401 when a token is not sent', async () => {
    const blogsAtDbInit = await helper.blogsInTheDB()
    const blogToBeDeleted = blogsAtDbInit[0]

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .expect(401)
  })

  test('succeeds with status 204 if id is valid', async () => {
    const blogsAtDbInit = await helper.blogsInTheDB()
    const blogToBeDeleted = blogsAtDbInit[0]

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAfterDeleteOperation = await helper.blogsInTheDB()

    expect(blogsAfterDeleteOperation).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAfterDeleteOperation.map(blog => blog.title)

    expect(titles).not.toContain(blogToBeDeleted.title)
  })
})

describe('updating a blog', () => {
  test('succeeds with status 200 if id is valid and the blog is updated', async () => {
    const blogsAtDbInit = await helper.blogsInTheDB()
    const blogToBeUpdated = blogsAtDbInit[0]

    const updatedBlogInfo = {
      title: 'someTitle',
      author: 'someAuthor',
      likes: 1000
    }

    const result = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(updatedBlogInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogAfterUpdateOperation = await helper.getBlogByIdFromDB(blogToBeUpdated.id)

    expect(result.body.title).toBe('someTitle')

    expect(blogAfterUpdateOperation.id).toBe(blogToBeUpdated.id)
    expect(blogAfterUpdateOperation.title).toBe('someTitle')
    expect(blogAfterUpdateOperation.author).toBe('someAuthor')
    expect(blogAfterUpdateOperation.likes).toBe(1000)
  })

  test('fails with status 404 if id is not valid', async () => {
    const updatedBlogInfo = {
      title: 'someTitle',
      author: 'someAuthor',
      likes: 1000
    }

    await api
      .put(`/api/blogs/${helper.nonExistingId}`)
      .send(updatedBlogInfo)
      .expect(404)

  })
})

afterAll(() => {
  mongoose.connection.close()
})