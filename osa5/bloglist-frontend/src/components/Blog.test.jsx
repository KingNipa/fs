import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '1',
    title: 'Marvelin tarina',
    author: 'Marvelmies',
    url: 'www.marvelmies.fi',
    likes: 150,
    user: { id: '250', name: 'Marvelmias' }
  }

  const mockAdd = vi.fn()
  const mockRemove = vi.fn()
  const currentUser = { id: '1230' }  

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        addLikes={mockAdd}
        removeBlog={mockRemove}
        currentUser={currentUser}
      />
    )
  })

  test('renderöi blogin titlen ja authorin mutta ei renderöi oletusarvoisesti urlia eikä likejen määrää', () => {
    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeInTheDocument()
    expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
    expect(screen.queryByText(/likes/i)).not.toBeInTheDocument()
  })
     
    test('url, likejen määrä ja käyttäjä näytetään, kun blogin kaikki tiedot näyttävää nappia on painettu', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText(blog.url)).toBeInTheDocument() 
    expect(screen.getByText(`likes ${blog.likes}`)).toBeInTheDocument()
    expect(screen.getByText(blog.user.name)).toBeInTheDocument()
  })


  test('jos komponentin like-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockAdd).toHaveBeenCalledTimes(2)
  })
})
