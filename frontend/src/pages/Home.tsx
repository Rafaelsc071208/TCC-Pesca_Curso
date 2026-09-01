import { useEffect, useState } from "react"
import axios from "axios"

import Header from "../components/Header"
import FilterSidebar from "../components/FilterSidebar"
import CourseList from "../components/CourseList"
import { calculateDistanceKm } from "../utils/distance"
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
  lat?: number
  lng?: number
}

export default function Home() {

  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState("")

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  )

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  const [selectedModality, setSelectedModality] = useState("")
  const [selectedPaymentType, setSelectedPaymentType] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("")

  const [selectedMinRating, setSelectedMinRating] = useState(0)

  const [courses, setCourses] = useState<Course[]>([])

  const [minPrice, setMinPrice] = useState(0)

  const [maxPrice, setMaxPrice] = useState(999999)

  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
  const [radiusKm, setRadiusKm] = useState(0) // 0 = sem limite de distância
  const [locationDenied, setLocationDenied] = useState(false)

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationDenied(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setLocationDenied(false)
      },
      () => {
        setLocationDenied(true)
      }
    )
  }

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

    const distanceKm =
    userLocation && course.lat && course.lng
      ? calculateDistanceKm(userLocation.lat, userLocation.lng, course.lat, course.lng)
      : null

    const matchesRadius =
      radiusKm === 0 ||
      distanceKm === null ||
      distanceKm <= radiusKm

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
      matchesRadius &&
      matchesModality &&
      matchesPaymentType &&
      matchesPeriod
    )
  })

  // combina distância e nota num único critério de ordenação, só quando a localização está ativa
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!userLocation) return 0

    const distA = a.lat && a.lng ? calculateDistanceKm(userLocation.lat, userLocation.lng, a.lat, a.lng) : 999
    const distB = b.lat && b.lng ? calculateDistanceKm(userLocation.lat, userLocation.lng, b.lat, b.lng) : 999

    // cada 20km "custam" o equivalente a 1 estrela de nota — ajuste o divisor pra pesar mais ou menos a distância
    const scoreA = (a.rating || 0) - distA / 20
    const scoreB = (b.rating || 0) - distB / 20

    return scoreB - scoreA
  })

  const totalPages = Math.max(1, Math.ceil(sortedCourses.length / PAGE_SIZE))
  const paginatedCourses = sortedCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search, selectedCategory, minPrice, maxPrice, selectedMinRating, selectedModality, selectedPaymentType, selectedPeriod, radiusKm, userLocation])

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
        userLocation={userLocation}
        radiusKm={radiusKm}
        setRadiusKm={setRadiusKm}
        locationDenied={locationDenied}
        onRequestLocation={requestLocation}
        onClose={() => setShowFilters(false)}
      />

      <div className="pt-[90px] pb-10">
        <CourseList
          courses={paginatedCourses}
          favoriteIds={favoriteIds}
          onToggleFavorite={user?.role === "user" ? handleToggleFavorite : undefined}
        />

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
