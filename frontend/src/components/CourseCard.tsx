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
      background: "#bdbdbd",
      padding: "15px",
      borderRadius: "10px"
    }}>
      <h3>{title}</h3>

      <p>{category}</p>

      <p>R$ {price.toFixed(2)}</p>

      <Link to={`/course/${id}`}>
        <button
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            border: "none",
            borderRadius: "6px",
            background: "#56c596",
            color: "white",
            cursor: "pointer"
          }}
        >
          Ver mais
        </button>
      </Link>
    </div>
  )
}