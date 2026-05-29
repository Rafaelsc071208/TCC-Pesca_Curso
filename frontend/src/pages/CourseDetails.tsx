import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"

type Course = {
  id: number
  title: string
  description: string
  category: string
  price: number
  link: string
  description_det: string
  endereco: string
}

export default function CourseDetails() {

  const { id } = useParams()

  const [course, setCourse] = useState<Course | null>(null)

  const getExternalLink = (link: string) => {
    const trimmedLink = link?.trim()

    if (!trimmedLink) return "#"

    return /^https?:\/\//i.test(trimmedLink)
      ? trimmedLink
      : `https://${trimmedLink}`
  }



  // buscar curso
  useEffect(() => {

    axios
      .get("http://localhost:3000/courses")
      .then(response => {

        const foundCourse = response.data.find(
          (course: Course) =>
            course.id === Number(id)
        )

        setCourse(foundCourse)
      })

      .catch(error => {
        console.error(error)
      })

  }, [id])



  // loading
  if (!course) {
    return <h1>Carregando...</h1>
  }



  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          width: "100%",
          height: "70px",
          background: "#26786e",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          boxSizing: "border-box"
        }}
      >

        <Link to="/">

          <button
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#56c596",
              color: "white",
              cursor: "pointer"
            }}
          >
            Voltar
          </button>

        </Link>

      </div>



      {/* CONTEÚDO */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          padding: "30px"
        }}
      >

        {/* ESQUERDA */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
        >

          {/* IMAGEM/PREVIEW */}
          <div
            style={{
              width: "100%",
              height: "400px",
              background: "#d9d9d9",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "28px",
              color: "#555"
            }}
          >
            PREVIEW DO CURSO
          </div>



          {/* DESCRIÇÃO DETALHADA */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >

            <h2>
              Sobre o curso
            </h2>

            <p>
              {course.description_det}
            </p>

          </div>

        </div>



        {/* DIREITA */}
        <div
          style={{
            width: "350px",
            background: "#2e7d5a",
            color: "white",
            padding: "25px",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "fit-content"
          }}
        >

          <h1>
            {course.title}
          </h1>



          <div>
            <strong>Descrição:</strong>

            <p>
              {course.description}
            </p>
          </div>



          <div>
            <strong>Categoria:</strong>

            <p>
              {course.category}
            </p>
          </div>



          <div>
            <strong>Preço:</strong>

            <p>
              R$ {course.price}
            </p>
          </div>



          <div>
            <strong>Endereço:</strong>

            <p>
              {course.endereco}
            </p>
          </div>



          {/* BOTÃO */}
          
          <a
            href={getExternalLink(course.link)}
            target="_blank"
            rel="noopener noreferrer"
          >

            <button
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "10px",
                background: "#56c596",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold"
              }}
            >
              Acessar Curso
            </button>

          </a>

        </div>

      </div>

    </div>
  )
}