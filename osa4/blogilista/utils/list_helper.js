const dummy = (blogs) => {
  return 1
}

const allLikes = (blogs) => {
  return blogs.reduce((yht, blog) => yht + (blog.likes || 0), 0)
}

//4.5*
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  let favorite = blogs[0]
  for (let i = 1; i < blogs.length; i++) {
    if ((blogs[i].likes || 0) > (favorite.likes || 0)) {
      favorite = blogs[i]
    }
  }
  return favorite
}

module.exports = {
  dummy,
  allLikes,
  favoriteBlog
}

