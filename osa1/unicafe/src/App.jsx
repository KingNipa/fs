//1.10: unicafe step5

import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const StatisticLine = ({ text, value }) => (
  <div>
    {text} {value} 
  </div>
)

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  if (all == 0) {
    return <p>No feedback given</p>
  }
  const average = ((good - bad) / all)
  const positive = ((good/all) * 100+'%')

   return (
    <div className="statistics">
      <StatisticLine text="good"     value={good}     />
      <StatisticLine text="neutral"  value={neutral}  />
      <StatisticLine text="bad"      value={bad}      />
      <StatisticLine text="all"      value={all}      />
      <StatisticLine text="average"  value={average}  />
      <StatisticLine text="positive" value={positive} />
    </div>
  )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} text="good" />
      <Button onClick={handleNeutral} text="neutral" />
      <Button onClick={handleBad} text="bad" />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App