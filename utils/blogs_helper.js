const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    }
  ]
  
const blogsInTheDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const getBlogByIdFromDB = async (id) => {
    const blog = await Blog.findById(id)
    return blog.toJSON();
}

const nonExistingId = async () => {
    const note = new Blog({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12, 
    })
    await note.save()
    await note.remove()
  
    return note._id.toString()
  }

module.exports = {
    initialBlogs, blogsInTheDB, nonExistingId, getBlogByIdFromDB
}