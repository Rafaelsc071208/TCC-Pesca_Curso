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
  modality?: string
  images?: string[]
  rating?: number
  reviewCount?: number
}

export default function Home() {

  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState("")

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  )

  const [selectedCategory, setSelectedCategory] = useState("")

  const [selectedMinRating, setSelectedMinRating] = useState(0)

  const [courses, setCourses] = useState<Course[]>([])

  const [minPrice, setMinPrice] = useState(0)

  const [maxPrice, setMaxPrice] = useState(999999)

  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  useEffect(() => {
    if (!user?.id) return

    axios
      .get(`http://localhost:3000/favorites/${user.id}/ids`)
      .then(response => setFavoriteIds(response.data))
      .catch(error => console.error(error))
  }, [])

  async function handleToggleFavorite(courseId: number) {
    const alreadyFavorited = favoriteIds.includes(courseId)

    try {
      if (alreadyFavorited) {
        await axios.delete(`http://localhost:3000/favorites/${user.id}/${courseId}`)
        setFavoriteIds(prev => prev.filter(id => id !== courseId))
      } else {
        await axios.post("http://localhost:3000/favorites", {
          user_id: user.id,
          course_id: courseId
        })
        setFavoriteIds(prev => [...prev, courseId])
      }
    } catch (error) {
      console.error(error)
      alert("Faça login para favoritar cursos")
    }
  }


  // BUSCAR CURSOS DA API
  useEffect(() => {

    axios
      .get(`http://localhost:3000/courses?search=${search}`)
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

    const matchesRating =
      selectedMinRating === 0 ||
      (course.rating || 0) >= selectedMinRating

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesRating
    )
  })



  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">

      <Header
        search={search}
        setSearch={setSearch}
        onOpenFilters={() => setShowFilters(prev => !prev)}
      />

      {showFilters && (
        <FilterSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          selectedMinRating={selectedMinRating}
          setSelectedMinRating={setSelectedMinRating}
          onClose={() => setShowFilters(false)}
        />
      )}

      <div className="pt-[90px]">
        <CourseList
          courses={filteredCourses}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

    </div>
  )
}
