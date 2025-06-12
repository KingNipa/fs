import React from 'react'

const App = ({ good, ok, bad, Good, Ok, Bad, Zero }) => (
  <div>
    <button onClick={Good}>good</button>
    <button onClick={Ok}>ok</button>
    <button onClick={Bad}>bad</button>
    <button onClick={Zero}>reset stats</button>

    <div>good {good}</div>
    <div>ok {ok}</div>
    <div>bad {bad}</div>
  </div>
)

export default App