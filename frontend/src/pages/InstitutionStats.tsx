import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import Header from "../components/Header"
import StarRating from "../components/StarRating"
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"
import RequestVerification from "./RequestVerification"
import { useToast } from "../context/ToastContext"

const API_URL = "http://localhost:3000"

type Section = "overview" | "courses" | "verification"

type Course = {
  id: number
  title: string
  institution_name: string
  price: number
  rating?: number
  reviewCount?: number
}

type Overview = {
  courseCount: number
  views: number
  clicks: number
  favorites: number
  reviewCount: number
  averageRating: number
}

type CourseStats = {
  views: number
  clicks: number
  favorites: number
  reviewCount: number
  averageRating: number
  reviews: { id: number, rating: number, comment: string, username: string, created_at: string }[]
}

// cartãozinho reutilizável de número grande
function StatCard({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <span className="block text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <strong className="block text-3xl text-gray-900 dark:text-gray-100 mt-1">{value}</strong>
    </div>
  )
}

export default function InstitutionStats() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const { showToast } = useToast()

  const [search, setSearch] = useState("")
  const [section, setSection] = useState<Section>("overview")
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  const [overview, setOverview] = useState<Overview | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null)
  const [history, setHistory] = useState<{ month: string, avgRating: number }[]>([])
  const [confirmingDelete, setConfirmingDelete] = useState<Course | null>(null)

  // resumo geral
  useEffect(() => {
    axios.get(`${API_URL}/courses/stats/institution/${user.id}`)
      .then(res => setOverview(res.data))
      .catch(err => console.error(err))
  }, [])

  // lista de cursos da instituição
  useEffect(() => {
    axios.get(`${API_URL}/courses/my/${user.id}`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
  }, [])

  // estatísticas do curso selecionado
  useEffect(() => {
    if (!selectedCourseId) return

    axios.get(`${API_URL}/courses/${selectedCourseId}/stats`)
      .then(res => setCourseStats(res.data))
      .catch(err => console.error(err))

    axios.get(`${API_URL}/courses/${selectedCourseId}/rating-history`)
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
  }, [selectedCourseId])

  async function handleDeleteCourse(id: number) {
    try {
      await axios.delete(`${API_URL}/courses/${id}?requesterId=${user.id}`)
      setCourses(prev => prev.filter(c => c.id !== id))
      setSelectedCourseId(null)
      showToast("Curso excluído")
    } catch (error) {
      console.error(error)
      alert("Erro ao excluir o curso")
    }
  }

  function menuButtonClass(value: Section) {
    const active = section === value && !selectedCourseId
    return `w-full text-left px-4 py-3 rounded-lg cursor-pointer transition-colors ${
      active
        ? "bg-brand-teal text-white font-bold"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
    }`
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />

      <div className="pt-[130px] md:pt-[90px] pb-10 px-4 md:px-6 flex flex-col md:flex-row gap-6">

        {/* MENU LATERAL */}
        <aside className="w-full md:w-[220px] shrink-0 bg-white dark:bg-neutral-800 rounded-xl p-3 h-fit shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <button className={menuButtonClass("overview")} onClick={() => { setSection("overview"); setSelectedCourseId(null) }}>
            📊 Estatísticas gerais
          </button>
          <button className={menuButtonClass("courses")} onClick={() => { setSection("courses"); setSelectedCourseId(null) }}>
            📚 Meus cursos
          </button>
          <button className={menuButtonClass("verification")} onClick={() => { setSection("verification"); setSelectedCourseId(null) }}>
            ✅ Verificação
          </button>
        </aside>

        {/* CONTEÚDO */}
        <main className="flex-1">

          {/* ESTATÍSTICAS GERAIS */}
          {section === "overview" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Estatísticas gerais
              </h1>

              {!overview ? (
                <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
              ) : (
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
                  <StatCard label="Cursos publicados" value={overview.courseCount} />
                  <StatCard label="Visualizações" value={overview.views} />
                  <StatCard label="Cliques no link" value={overview.clicks} />
                  <StatCard label="Favoritados" value={overview.favorites} />
                  <StatCard label="Avaliações" value={overview.reviewCount} />
                  <StatCard label="Nota média" value={overview.averageRating.toFixed(2)} />
                </div>
              )}
            </div>
          )}

          {/* LISTA DE CURSOS */}
          {section === "courses" && !selectedCourseId && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Meus cursos
              </h1>

              {courses.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Você ainda não publicou nenhum curso.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {courses.map(course => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className="bg-white dark:bg-neutral-800 rounded-xl p-4 text-left cursor-pointer flex justify-between items-center gap-3 transition-transform hover:scale-[1.01] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                    >
                      <div>
                        <strong className="block text-gray-900 dark:text-gray-100">{course.title}</strong>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          R$ {Number(course.price || 0).toFixed(2)}/mês
                        </span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ESTATÍSTICAS DE UM CURSO */}
          {section === "courses" && selectedCourseId && selectedCourse && (
            <div>
              <button
                onClick={() => setSelectedCourseId(null)}
                className="mb-4 px-4 py-2 rounded-lg bg-brand-green text-white cursor-pointer transition-transform hover:scale-105"
              >
                ← Voltar para a lista
              </button>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedCourse.title}
              </h1>

              {/* AÇÕES */}
              <div className="flex gap-3 flex-wrap my-4">
                <Link to={`/course/${selectedCourse.id}`}>
                  <button className="px-4 py-2 rounded-lg bg-brand-teal text-white cursor-pointer">
                    Ver página do curso
                  </button>
                </Link>

                <Link to={`/edit-course/${selectedCourse.id}`}>
                  <button className="px-4 py-2 rounded-lg bg-brand-green text-white cursor-pointer">
                    ✏️ Editar curso
                  </button>
                </Link>

                <button
                  onClick={() => setConfirmingDelete(selectedCourse)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white cursor-pointer hover:bg-red-700"
                >
                  🗑️ Excluir curso
                </button>
              </div>

              {!courseStats ? (
                <p className="text-gray-500 dark:text-gray-400">Carregando estatísticas...</p>
              ) : (
                <>
                  <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
                    <StatCard label="Visualizações" value={courseStats.views} />
                    <StatCard label="Cliques no link" value={courseStats.clicks} />
                    <StatCard label="Favoritado por" value={courseStats.favorites} />
                    <StatCard label="Avaliações" value={courseStats.reviewCount} />
                    <StatCard label="Nota média" value={courseStats.averageRating.toFixed(2)} />
                  </div>

                  {/* GRÁFICO */}
                  {history.length > 0 && (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 mt-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Evolução da nota
                      </h2>

                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={history}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 5]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="avgRating" stroke="#26786e" strokeWidth={2} name="Nota média" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* COMENTÁRIOS */}
                  <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 mt-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                      Avaliações recebidas
                    </h2>

                    {courseStats.reviews.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">Ainda não há avaliações.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {courseStats.reviews.map(review => (
                          <div key={review.id} className="border-b border-gray-100 dark:border-neutral-700 pb-3">
                            <div className="flex justify-between items-center">
                              <strong className="text-gray-900 dark:text-gray-100">{review.username}</strong>
                              <StarRating rating={review.rating} readOnly size={14} precise />
                            </div>
                            {review.comment && (
                              <p className="mt-1 mb-0 text-gray-600 dark:text-gray-400">{review.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* VERIFICAÇÃO */}
          {section === "verification" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Verificação da instituição
              </h1>
              <RequestVerification />
            </div>
          )}

        </main>
      </div>

      {confirmingDelete && (
        <ConfirmDeleteModal
          title="Excluir este curso?"
          onCancel={() => setConfirmingDelete(null)}
          onConfirm={() => {
            handleDeleteCourse(confirmingDelete.id)
            setConfirmingDelete(null)
          }}
        >
          <strong className="block mb-1">{confirmingDelete.title}</strong>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Essa ação não pode ser desfeita.
          </span>
        </ConfirmDeleteModal>
      )}
    </div>
  )
}