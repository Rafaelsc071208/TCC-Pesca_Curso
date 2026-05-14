import { Link } from "react-router-dom"

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
      </div>
    </div>
  )
}