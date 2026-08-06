import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import ImageCarousel from "../components/ImageCarousel"
import StarRating from "../components/StarRating"

type Review = {
  id: number
  course_id: number
  user_id: number
  rating: number
  comment: string
  created_at: string
  username: string
}

type Course = {
  id: number
  title: string
  description: string
  category: string
  price: number
  link: string
  description_det: string
  endereco: string
  images?: string[]
}

export default function CourseDetails() {

  const { id } = useParams()

  const [course, setCourse] = useState<Course | null>(null)

  const user = JSON.parse(localStorage.getItem("user") || "null")

  const [reviews, setReviews] = useState<Review[]>([])
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  function fetchReviews() {
    axios
      .get(`http://localhost:3000/reviews/${id}`)
      .then(response => setReviews(response.data))
      .catch(error => console.error(error))
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()

    if (newRating === 0) {
      alert("Selecione uma nota de 1 a 5 estrelas")
      return
    }

    try {
      await axios.post("http://localhost:3000/reviews", {
        course_id: id,
        user_id: user.id,
        rating: newRating,
        comment: newComment
      })

      setNewRating(0)
      setNewComment("")
      fetchReviews()
    } catch (error) {
      console.error(error)
      alert("Erro ao enviar avaliação")
    }
  }

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

    fetchReviews() 

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
          position: "fixed",
          top: 0,
          width: "100%",
          left: 0,
          height: "70px",
          background: "#26786e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxSizing: "border-box",
          zIndex: 1000
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
          padding: "30px",
          paddingTop: "70px",
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
            <ImageCarousel images={course.images || []} height="400px" />
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

          {/* AVALIAÇÕES */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <h2 style={{ margin: 0 }}>Avaliações</h2>
              {reviews.length > 0 && (
                <>
                  <StarRating rating={Math.round(averageRating)} readOnly size={18} />
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    {averageRating.toFixed(1)} ({reviews.length} avaliação{reviews.length > 1 ? "ões" : ""})
                  </span>
                </>
              )}
            </div>

            {/* FORMULÁRIO DE NOVA AVALIAÇÃO */}
            {user ? (
              <form
                onSubmit={handleSubmitReview}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "25px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #eee"
                }}
              >
                <StarRating rating={newRating} onRate={setNewRating} size={26} />

                <textarea
                  placeholder="Conte como foi sua experiência com esse curso..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                />

                <button
                  type="submit"
                  style={{
                    alignSelf: "flex-start",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#26786e",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Enviar avaliação
                </button>
              </form>
            ) : (
              <p style={{ color: "#666", marginBottom: "20px" }}>
                <Link to="/login" style={{ color: "#26786e", fontWeight: "bold" }}>Faça login</Link> para avaliar este curso.
              </p>
            )}

            {/* LISTA DE AVALIAÇÕES */}
            {reviews.length === 0 ? (
              <p style={{ color: "#999" }}>Ainda não há avaliações para este curso.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {reviews.map(review => (
                  <div key={review.id} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{review.username}</strong>
                      <StarRating rating={review.rating} readOnly size={16} />
                    </div>
                    {review.comment && (
                      <p style={{ margin: "6px 0 0", color: "#444" }}>{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
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