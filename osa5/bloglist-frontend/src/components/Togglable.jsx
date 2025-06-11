import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const hideStyle = { display: visible ? 'none' : '' }
  const showStyle = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility
  }))

  Togglable.displayName = 'Togglable'
  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired, children: PropTypes.node.isRequired }

  return (
    <div>
      <div style={hideStyle}>
        <button data-testid="toggle" onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showStyle}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable