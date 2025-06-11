import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Form from './Form'

test('lomake kutsuu createBlog-propsia oikeilla tiedoilla', async () => {
  const mockHandler = vi.fn()
  render(<Form createBlog={mockHandler} />)

  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByRole('button', { name: /create/i })

  const user = userEvent.setup()
  await user.type(inputs[0], 'Bloginen')
  await user.type(inputs[1], 'Potter')
  await user.type(inputs[2], 'www.wc.fi')
  await user.click(createButton)

  expect(mockHandler).toHaveBeenCalledTimes(1)
  expect(mockHandler).toHaveBeenCalledWith({
    title: 'Bloginen',
    author: 'Potter',
    url: 'www.wc.fi'
  })
})
