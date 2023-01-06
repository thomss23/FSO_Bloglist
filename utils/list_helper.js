const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((partialSum, el)  => partialSum + el.likes, 0)
}

module.exports = {
  dummy, totalLikes
}