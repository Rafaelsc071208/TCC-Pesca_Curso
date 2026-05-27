import { useEffect, useState } from "react"
import axios from "axios"

import Header from "../components/Header"
import FilterSidebar from "../components/FilterSidebar"
import CourseList from "../components/CourseList"

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

export default function Home() {

  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("")

  const [courses, setCourses] = useState<Course[]>([])



  // BUSCAR CURSOS DA API
  useEffect(() => {

    axios
      .get("http://localhost:3000/courses")
      .then(response => {
        setCourses(response.data)
      })
      .catch(error => {
        console.error(error)
      })

  }, [])



  // FILTROS
  const filteredCourses = courses.filter(course => {

    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === "" ||
      course.category === selectedCategory

    return matchesSearch && matchesCategory
  })



  return (
    <div>

      <Header
        search={search}
        setSearch={setSearch}
      />

      <div style={{
        marginTop: "70px",
        padding: "10px 20px"
      }}>
        <button
          onClick={() => setShowFilters(true)}
        >
          Filtros
        </button>
      </div>

      {showFilters && (
        <FilterSidebar
          setSelectedCategory={setSelectedCategory}
          onClose={() => setShowFilters(false)}
        />
      )}

      <CourseList courses={filteredCourses} />

    </div>
  )
}