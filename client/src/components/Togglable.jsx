import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideOnVisible = { display: visible ? 'none' : '' }
  const showOnVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })
  return (
    <div>
      <div style={hideOnVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showOnVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}
export default Togglable
