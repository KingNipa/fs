import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import reducer from './reducer'
import App from './App'

const store = createStore(reducer)
const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {


  const { good, ok, bad } = store.getState()
  root.render(
    <App
      good={good}
      ok={ok}
      bad={bad}
      Good={() => store.dispatch({ type: 'GOOD' })}
      Ok={() => store.dispatch({ type: 'OK' })}
      Bad={() => store.dispatch({ type: 'BAD' })}
      Zero={() => store.dispatch({ type: 'ZERO' })}
    />
  )
}


renderApp()
store.subscribe(renderApp)

