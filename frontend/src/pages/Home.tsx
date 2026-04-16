import { useState } from "react"
import Header from "../components/Header"
import CourseList from "../components/CourseList"
import FilterSidebar from "../components/FilterSidebar"

export default function Home() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div>
      {/* HEADER */}
      <Header />

      {/* BOTÃO DE FILTRO */}
      <div style={{
        marginTop: "70px",
        padding: "10px 20px"
      }}>
        <button
          onClick={() => setShowFilters(true)}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "none",
            background: "#56c596",
            color: "white",
            cursor: "pointer"
          }}
        >
          Filtros
        </button>
      </div>

      {/* SIDEBAR */}
      {showFilters && (
        <FilterSidebar onClose={() => setShowFilters(false)} />
      )}

      {/* LISTA DE CURSOS (ESTILO CARD) */}
      <CourseList />
    </div>
  )
}
