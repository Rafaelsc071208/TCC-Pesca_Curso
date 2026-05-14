import { Link, useParams } from "react-router-dom"
import { courses } from "../data/courses"

export default function CourseDetails() {
  const { id } = useParams()

  const course = courses.find(course => course.id === id)

  if (!course) {
    return <h1>Curso não encontrado</h1>
  }

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "#f5f5f5"
    }}>

      {/* HEADER */}
      <div style={{
        width: "100%",
        height: "60px",
        background: "#4fb5a8",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        boxSizing: "border-box"
      }}>
        <Link to="/">
          <button style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            background: "#26786e",
            color: "white"
          }}>
            Voltar
          </button>
        </Link>
      </div>

      {/* CONTEÚDO */}
      <div style={{
        display: "flex",
        height: "calc(100vh - 60px)"
      }}>

        {/* ÁREA DE IMAGEM */}
        <div style={{
          flex: 1,
          padding: "20px",
          boxSizing: "border-box"
        }}>
          <div style={{
            width: "100%",
            height: "100%",
            background: "#d9d9d9",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "32px",
            color: "#555"
          }}>
            PREVIEW DA IMAGEM DO CURSO
          </div>
        </div>

        {/* PAINEL LATERAL */}
        <div style={{
          width: "320px",
          background: "#2e7d5a",
          color: "white",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          <h1>{course.title}</h1>

          <p>
            {course.description}
          </p>

          <div>
            <strong>Categoria:</strong>
            <p>{course.category}</p>
          </div>

          <div>
            <strong>Preço:</strong>
            <p>R$ {course.price}</p>
          </div>

          <div>
            <strong>Descrição Detalhada:</strong>
            <p>{course.description_det}</p>
          </div>
          <div>
            <strong>Endereço:</strong>
            <p>{course.endereco}</p>
          </div>

          <a
            href={course.link}
            target="_blank"
            style={{
              marginTop: "auto"
            }}
          >
            <button style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "#56c596",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}>
              Acessar Curso
            </button>
          </a>
        </div>

      </div>
    </div>
  )
}