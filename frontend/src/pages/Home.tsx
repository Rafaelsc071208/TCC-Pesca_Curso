import { useState } from "react"

import Header from "../components/Header"
import FilterSidebar from "../components/FilterSidebar"
import CourseList from "../components/CourseList"

import { courses } from "../data/courses"

export default function Home() {
  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("")

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
        <button onClick={() => setShowFilters(true)}
                 style={{
              width: "5%",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#56c596",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}>
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