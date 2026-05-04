import { useParams } from "react-router-dom"
import { courses } from "../data/courses"

export default function CourseDetails() {
  const { id } = useParams()

  const course = courses.find(course => course.id === id)

  if (!course) {
    return <h1>Curso não encontrado</h1>
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{course.title}</h1>

      <p>{course.description}</p>

      <p>Categoria: {course.category}</p>
        <p>Preço: R$ {course.price.toFixed(2)}</p>

      <a href={course.link} target="_blank">
        Acessar curso
      </a>
    </div>
  )
}