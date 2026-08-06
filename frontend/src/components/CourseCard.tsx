import { Link } from "react-router-dom"
import axios from "axios"
import ImageCarousel from "./ImageCarousel"
import StarRating from "./StarRating"

type Props = {
  id: string
  title: string
  institution_name: string
  modality?: string
  price: number
  images?: string[]
  category: string
  rating?: number
  reviewCount?: number
  isFavorited?: boolean
  onToggleFavorite?: () => void
}

export default function CourseCard({
  id,
  title,
  category,
  price,
  institution_name,
  images,
  isFavorited,
  onToggleFavorite
}: Props) {
  
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  )

  async function handleDelete() {
    try {
      await axios.delete(
        `http://localhost:3000/courses/${id}?requesterId=${user.id}`
      )
      alert("Curso deletado")
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert("Você não tem permissão para deletar este curso")
    }
  }

  return (
    <div style={{
      background: "var(--bg-card-alt)",
      padding: "2px",
      borderRadius: "10px",
      textAlign: "center"
    }}>
      <h3 style={{ color: "var(--text-primary)" }}>{title}</h3>
      <div style={{
        background: "var(--bg-card)",
        padding: "10px",
        borderRadius: "10px",
        textAlign: "left"
      }}>
        <ImageCarousel images={images || []} height="180px" />

        <h3 style={{ color: "var(--text-primary)" }}>{institution_name}</h3>

        {modality && (
          <p style={{ color: "var(--text-secondary)", margin: "2px 0" }}>{modality}</p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0" }}>
          <StarRating rating={Math.round(rating || 0)} readOnly size={14} />
          <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
            ({reviewCount || 0})
          </span>
        </div>

        <p style={{ color: "var(--text-secondary)" }}>{category}</p>

        <p style={{ color: "var(--text-secondary)" }}>R$ {price.toFixed(2)}/mês</p>

        <Link to={`/course/${id}`}>
          <button
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              border: "none",
              borderRadius: "6px",
              background: "#26786e",
              color: "white",
              cursor: "pointer"
            }}
          >
            Ver mais
          </button>
        </Link>

        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            style={{
              marginTop: "10px",
              marginLeft: "8px",
              background: "none",
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            {isFavorited ? "❤️" : "🤍"}
          </button>
        )}

        {user?.isAdmin === 1 && (
          <button
            onClick={handleDelete}
            style={{
              marginTop: "10px",
              marginLeft: "8px",
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Deletar
          </button>
        )}
      </div>
    </div>
  )
}