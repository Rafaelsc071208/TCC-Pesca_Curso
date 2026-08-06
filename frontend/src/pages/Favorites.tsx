import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import CourseList from "../components/CourseList"

type Course = {
  id: number
  title: string
  category: string
  price: number
  institution_name: string
  images?: string[]
}

export default function Favorites() {
  const [search, setSearch] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const user = JSON.parse(localStorage.getItem("user") || "null")

  function fetchFavorites() {
    axios
      .get(`http://localhost:3000/favorites/${user.id}`)
      .then(response => {
        setCourses(response.data)
        setFavoriteIds(response.data.map((c: Course) => c.id))
      })
      .catch(error => console.error(error))
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  async function handleToggleFavorite(courseId: number) {
    try {
      await axios.delete(`http://localhost:3000/favorites/${user.id}/${courseId}`)
      setCourses(prev => prev.filter(c => c.id !== courseId))
      setFavoriteIds(prev => prev.filter(id => id !== courseId))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />
      <div style={{ marginTop: "90px" }}>
        <h1 style={{ padding: "0 20px" }}>Cursos favoritados</h1>

        {courses.length === 0 ? (
          <p style={{ padding: "0 20px", color: "#888" }}>
            Você ainda não favoritou nenhum curso.
          </p>
        ) : (
          <CourseList
            courses={courses}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
    </div>
  )
}