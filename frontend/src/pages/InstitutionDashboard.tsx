import { useEffect, useState } from "react"
import axios from "axios"

import Header from "../components/Header"
import FilterSidebar from "../components/FilterSidebar"
import CourseList from "../components/CourseList"
import { getPeriodBucket } from "../utils/period"

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
  payment_type?: string
  period?: string
  images?: string[]
  rating?: number
  reviewCount?: number
}

export default function InstitutionDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  )

  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("")

  const [selectedMinRating, setSelectedMinRating] = useState(0)

  const [selectedModality, setSelectedModality] = useState("")
  const [selectedPaymentType, setSelectedPaymentType] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

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
      (course.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      (course.description || "")
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
      Number(course.price || 0) >= minPrice &&
      Number(course.price || 0) <= maxPrice

    const matchesRating =
      selectedMinRating === 0 ||
      (course.rating || 0) >= selectedMinRating

    const matchesModality =
      selectedModality === "" || course.modality === selectedModality

    const matchesPaymentType =
      selectedPaymentType === "" || course.payment_type === selectedPaymentType

    const matchesPeriod =
      selectedPeriod === "" || getPeriodBucket(course.period) === selectedPeriod

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesModality &&
      matchesPaymentType &&
      matchesPeriod
    )
  })

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE))
  const paginatedCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search, selectedCategory, minPrice, maxPrice, selectedMinRating, selectedModality, selectedPaymentType, selectedPeriod])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">

      <Header
        search={search}
        setSearch={setSearch}
        onOpenFilters={() => setShowFilters(prev => !prev)}
      />

      <FilterSidebar
        open={showFilters}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        selectedMinRating={selectedMinRating}
        setSelectedMinRating={setSelectedMinRating}
        selectedModality={selectedModality}
        setSelectedModality={setSelectedModality}
        selectedPaymentType={selectedPaymentType}
        setSelectedPaymentType={setSelectedPaymentType}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        userLocation={null}
        radiusKm={0}
        setRadiusKm={() => {}}
        locationDenied={false}
        onRequestLocation={() => {}}
        onClose={() => setShowFilters(false)}
      />

      <div className="pt-[90px] pb-10">
        <CourseList courses={paginatedCourses} />

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
             <button
              disabled={page === 1}
              onClick={() => {
                setPage(p => p - 1)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="px-4 py-2 rounded-lg bg-brand-teal text-white disabled:opacity-40 cursor-pointer transition-colors hover:bg-brand-teal-dark"
            >
              ← Anterior
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => {
                setPage(p => p + 1)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className="px-4 py-2 rounded-lg bg-brand-teal text-white disabled:opacity-40 cursor-pointer transition-colors hover:bg-brand-teal-dark"
            >
              Próxima →
            </button>
          </div>
        )}
      </div>

    </div>
  )
}