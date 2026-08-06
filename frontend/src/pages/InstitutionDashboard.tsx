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
  institution_name: string
  images?: string[]
}

export default function InstitutionDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  )

  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("")

  const [courses, setCourses] = useState<Course[]>([])

  const [minPrice, setMinPrice] = useState(0)

  const [maxPrice, setMaxPrice] = useState(999999)



  // BUSCAR CURSOS DA API
  useEffect(() => {

    axios
      .get(`http://localhost:3000/courses/my/${user.id}`)
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
      course.title
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      course.description
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesCategory =

      selectedCategory === ""

      ||

      (
        selectedCategory === "Presencial" &&
        (
          course.category === "Presencial" ||
          course.category === "Misto"
        )
      )

      ||

      (
        selectedCategory === "Online" &&
        (
          course.category === "Online" ||
          course.category === "Misto"
        )
      )

      ||

      (   
        selectedCategory === "Misto" &&
        course.category === "Misto"
      )

    const matchesPrice =
      course.price >= minPrice &&
      course.price <= maxPrice

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice
    )
  })



  return (
    <div>

      <Header
        search={search}
        setSearch={setSearch}
        onOpenFilters={() => setShowFilters(prev => !prev)}
    />

      {showFilters && (
        <FilterSidebar
          setSelectedCategory={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          onClose={() => setShowFilters(false)}
        />
      )}

      <div
        style={{
          marginTop: "90px"
        }}
      >
        <CourseList courses={filteredCourses} />
      </div>

    </div>
  )
}