import { useState } from 'react'

const Blog = ({ blog, addLikes, removeBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)


  const toggleVisibility = () => { setVisible(!visible) }

  const boxes = {
    paddingTop: 5,
    paddingLeft: 3,
    borderWidth: 2,
    marginBottom: 4,
    marginTop: 3,
    border: 'solid'
  }

  const buttonMargin = {
    marginLeft: 3
  }

  return (
    <div style={boxes}>
      <div>
        {blog.title} {blog.author}
        <button data-testid="view" onClick={toggleVisibility} style={buttonMargin}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div> likes {blog.likes}
            <button data-testid="like" onClick={() => addLikes(blog)} style={buttonMargin}>
            like</button>
          </div>

          <div>{blog.user && blog.user.name}</div>
          {currentUser?.id === blog.user?.id && (
            <button data-testid="remove" onClick={() => removeBlog(blog)}>
             remove
            </button> )}
        </div>
      )}
    </div>
  )
}

export default Blog
