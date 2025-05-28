import { useState, useEffect  } from 'react'
import jutut from './jutut/persons'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  const notificationsStyle = {
    color: type === 'success' ? 'green' : 'red',
    background: 'black',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    fontSize: 20
  };

  return (
    <div style={notificationsStyle}>
      {message}
    </div>
  );
};

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter}onChange={handleFilterChange} /> 
  </div>
);

const PersonForm  = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange}) => (
        <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}  />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>       
        <div>
          <button type="submit">add</button>
        </div>
      </form>
);

const Person = ({ person, removePerson }) => (
  <li>{person.name} {person.number} 
  <button onClick={() => removePerson(person.id, person.name)}>delete</button>
  </li> 
  );


const Persons = ({ personsToShow, removePerson }) => (
      <ul>
        {personsToShow.map(person =>
          <Person key={person.id} person={person} removePerson={removePerson}  />
        )}
      </ul> 
       
);


const App = () => {
  
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('');

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      jutut
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setNotification(`Deleted ${name}`);
        setNotificationType('success');
        setTimeout(() => {
          setNotification(null);
        }, 4000);
      })
      .catch(error => {
        alert(`The person '${name}' was already removed from server`)
        setPersons(persons.filter(person => person.id !== id))
      })
  }
};

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  useEffect(() => {
    jutut
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()

    // tarkistus että onko nimi jo listassa
    const nameExists = persons.some(person => person.name === newName);
   

    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
    } else {
    const personObject = {
      name: newName,
      number: newNumber,
     // id: persons.length + 1, tätä ei tarvitse enää
    }
    jutut
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      setNotification(`Added ${newName}`);
      setNotificationType('success');
      setTimeout(() => {
        setNotification(null);
      }, 3000);
  })

}}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter filter={filter} handleFilterChange={(event) => setFilter(event.target.value)} />
      <h3>add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        handleNumberChange={(event) => setNewNumber(event.target.value)}/>
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} removePerson={removePerson} /> 
    </div>
  )
}

export default App