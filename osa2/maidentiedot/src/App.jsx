import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [maat, setMaat] = useState([]) 
  const [haku, setHaut] = useState('')
 
  useEffect(() => {
    console.log(maat)
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => { 
        setMaat(response.data)
      })
  }, [])

  const rajaaMaat = maat.filter(country => country.name.common.toLowerCase().includes(haku.toLowerCase()));

  const handleHaku = (event) => {
    setHaut(event.target.value);
  };

  return (
    <div>
      find countries: <input value={haku} onChange={handleHaku} />
      {rajaaMaat.length > 10 ? (
        <p>Too many matches, specify another filter </p>
      ) : rajaaMaat.length > 1 ? (
        <ul>
          {rajaaMaat.map((country) => (
            <li key={country.tld}> {country.name.common}</li>
          ))}
        </ul>
      ) : rajaaMaat.length === 1 ? (
        <div> 
          <h2>{rajaaMaat[0].name.common} </h2>
         <p>Capital: {rajaaMaat[0].capital} </p>
         <p>area: {rajaaMaat[0].area} </p>
         <h3>languages:</h3>
         <p> {Object.values(rajaaMaat[0].languages).map((language) => (
              <li key={language}>{language}</li>
            ))} </p>
          <img src={rajaaMaat[0].flags.png} />  
         </div>  ) 
         
         : ( <p>No matches found</p>
        
        )}
         </div> 
  )
}

export default App
