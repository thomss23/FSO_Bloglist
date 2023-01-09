const dummy = (blogs) => {
  return 1
}

const favoriteBlog = (blogs) => {
  let maxLikes = Math.max(...blogs.map(blog => blog.likes))
  let maxLikedBlog = blogs.find(blog => blog.likes === maxLikes)

  if(!maxLikedBlog) return null

  return {
    title: maxLikedBlog.title,
    author: maxLikedBlog.author,
    likes: maxLikedBlog.likes
  }
}

const mostBlogs = (blogs) => {
  let map = new Map();

  blogs.forEach(blog => {
    map.set(blog.author, map.get(blog.author) === undefined ? 1 : map.get(blog.author) + 1)
  });

  let max = 0
  for(const [key, value] of map) {
    if(value > max) {
      max = value
    }
  }

  let result = {}
  for(const [key, value] of map) {
    if(value === max) {
      result.author = key
      result.blogs = value
    }
  }

  return result
}

const mostLikes = (blogs) => {
  let map = new Map();

  blogs.forEach(blog => {
    map.set(blog.author, map.get(blog.author) === undefined ? blog.likes : map.get(blog.author) + blog.likes)
  });

  let max = 0
  for(const [key, value] of map) {
    if(value > max) {
      max = value
    }
  }

  let result = {}
  for(const [key, value] of map) {
    if(value === max) {
      result.author = key
      result.likes = value
    }
  }

  return result
}

const totalLikes = (blogs) => {
  return blogs.reduce((partialSum, el)  => partialSum + el.likes, 0)
}

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

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, initialBlogs
}