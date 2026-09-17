import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"
import CourseList from "../components/CourseList"
import StarRating from "../components/StarRating"
import VerifiedBadge from "../components/VerifiedBadge"
import ShareButton from "../components/ShareButton"
import BackButton from "../components/BackButton"

const API_URL = "http://localhost:3000"

type Institution = {
  id: number
  username: string
  email: string
  is_verified: number
  averageRating: number
  courses: any[]
}

export default function InstitutionProfile() {
  const { id } = useParams()
  const [search, setSearch] = useState("")
  const [institution, setInstitution] = useState<Institution | null>(null)

  useEffect(() => {
    axios
      .get(`${API_URL}/institutions/${id}`)
      .then(response => setInstitution(response.data))
      .catch(error => console.error(error))
  }, [id])

  if (!institution) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
        <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />
        <p className="pt-[130px] md:pt-[90px] px-6 text-gray-900 dark:text-gray-100">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />

      <div className="pt-[130px] md:pt-[90px] px-5 pb-10">

        <BackButton />

        {/* CABEÇALHO DA INSTITUIÇÃO */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 mt-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              {institution.username}
              {institution.is_verified === 1 && <VerifiedBadge size={24} />}
            </h1>

            <ShareButton title={institution.username} url={window.location.href} />
          </div>

          <div className="flex items-center gap-2 mt-3">
            <StarRating rating={institution.averageRating} readOnly size={20} precise />
            <span className="text-gray-600 dark:text-gray-400">
              {institution.averageRating.toFixed(2)} · {institution.courses.length} curso(s)
            </span>
          </div>
        </div>

        {/* CURSOS DA INSTITUIÇÃO */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">
          Cursos oferecidos
        </h2>

        {institution.courses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Esta instituição ainda não publicou nenhum curso.
          </p>
        ) : (
          <CourseList courses={institution.courses} />
        )}
      </div>
    </div>
  )
}