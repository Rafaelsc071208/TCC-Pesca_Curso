import { Link } from "react-router-dom"
import axios from "axios"

type Props = {
  id: string
  title: string
  category: string
  price: number
}

export default function CourseCard({
  id,
  title,
  category,
  price,
}: Props) {
  const user = JSON.parse(
  localStorage.getItem("user") || "null"
)
async function handleDelete() {

  try {

    await axios.delete(
      `http://localhost:3000/courses/${id}`
    )

    alert("Curso deletado")

    window.location.reload()

  } catch (error) {
    console.error(error)
  }
}
  return (
    <div style={{
      background: "#e8e8e8",
      padding: "2px",
      borderRadius: "10px",
      textAlign: "center"

    }}>
      <h3>{title}</h3>
<div style={{
      background: "#ffffff",
      padding: "10px",
      borderRadius: "10px",
      textAlign: "left"

    }}>
      <p>{category}</p>

      <p>R$ {price.toFixed(2)}</p>

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
      {
  user?.isAdmin === 1 && (

    <button
      onClick={handleDelete}
      style={{
        marginTop: "10px",
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

  )
}
      </div>
    </div>
  )
}

