import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import StarRating from "../components/StarRating"

type Review = {
  id: number
  course_id: number
  course_title: string
  rating: number
  comment: string
  created_at: string
}

export default function MyReviews() {
  const [search, setSearch] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const user = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(() => {
    axios
      .get(`http://localhost:3000/reviews/user/${user.id}`)
      .then(response => setReviews(response.data))
      .catch(error => console.error(error))
  }, [])

  return (
    <div>
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />
      <div style={{ marginTop: "90px", padding: "0 20px 40px", maxWidth: "700px" }}>
        <h1>Minhas avaliações</h1>

        {reviews.length === 0 ? (
          <p style={{ color: "#888" }}>Você ainda não avaliou nenhum curso.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {reviews.map(review => (
              <div
                key={review.id}
                style={{
                  background: "white",
                  padding: "16px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Link to={`/course/${review.course_id}`} style={{ fontWeight: "bold", color: "#26786e", textDecoration: "none" }}>
                    {review.course_title}
                  </Link>
                  <StarRating rating={review.rating} readOnly size={16} />
                </div>
                {review.comment && (
                  <p style={{ margin: "8px 0 0", color: "#444" }}>{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}