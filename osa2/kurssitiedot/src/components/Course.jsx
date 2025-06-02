
const Header = ({ title }) => (
  <h3>{title}</h3>
)

const Content = ({ parts }) => (
  <div>
    {parts.map(part =>
      <Part key={part.id} part={part} />
    )}
  </div>
)

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = ({ parts }) => {
  const yhteensa = parts.reduce((yhteensa, osa) => yhteensa + osa.exercises, 0)
  return (
    <h4>
      total of {yhteensa} exercises
    </h4>
  )
}

const Course = ({ course }) => (
  <div>
    <Header title={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course