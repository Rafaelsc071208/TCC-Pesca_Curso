import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import { useToast } from "../context/ToastContext"
import BackButton from "../components/BackButton"
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"
import StarRating from "../components/StarRating"

const API_URL = "http://localhost:3000"
const USERS_PER_PAGE = 20
const MARKED_THRESHOLD = 10 // a partir de quantas denúncias a conta aparece marcada

type User = {
  id: number
  username: string
  email: string
  isAdmin: number
  role: string
  total_reports: number
}

type ReportItem = {
  id: number
  reason: string
  description: string
  username: string
  created_at: string
}

type ReportedCourse = {
  course_id: number
  title: string
  report_count: number
  reports: ReportItem[]
}

type ReportedReview = {
  review_id: number
  comment: string
  rating: number
  course_title: string
  report_count: number
  reports: ReportItem[]
}

type Tab = "courses" | "reviews" | "users"

const reportCardClass =
  "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-[10px] p-4 mb-3.5"

const deleteButtonClass =
  "bg-red-600 text-white border-none px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-red-700"

const dismissButtonClass =
  "ml-2 text-xs cursor-pointer text-gray-600 dark:text-gray-300"

const [confirmingCourse, setConfirmingCourse] = useState<ReportedCourse | null>(null)
const [confirmingUser, setConfirmingUser] = useState<User | null>(null)
const [confirmingReview, setConfirmingReview] = useState<ReportedReview | null>(null)

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("courses")

  const [users, setUsers] = useState<User[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [userPage, setUserPage] = useState(1)

  const [courseReportPage, setCourseReportPage] = useState(1)
  const [reviewReportPage, setReviewReportPage] = useState(1)
  const REPORTS_PER_PAGE = 20

  const [reportedCourses, setReportedCourses] = useState<ReportedCourse[]>([])
  const [reportedReviews, setReportedReviews] = useState<ReportedReview[]>([])
  const [search, setSearch] = useState("")

  const { showToast } = useToast()

  const admin = JSON.parse(localStorage.getItem("user") || "{}")

  function fetchAll() {
    axios.get(`${API_URL}/users?requesterId=${admin.id}`)
      .then(res => setUsers(res.data)).catch(err => console.error(err))

    axios.get(`${API_URL}/reports/courses?requesterId=${admin.id}`)
      .then(res => setReportedCourses(res.data)).catch(err => console.error(err))

    axios.get(`${API_URL}/reports/reviews?requesterId=${admin.id}`)
      .then(res => setReportedReviews(res.data)).catch(err => console.error(err))
  }

  useEffect(() => { fetchAll() }, [])

  async function handleDeleteUser(id: number) {
    try {
      await axios.delete(`${API_URL}/users/${id}?requesterId=${admin.id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
      showToast("Usuário excluído")
    } catch (error) {
      console.error(error)
      alert("Erro ao deletar usuário")
    }
  }

  async function handleDeleteCourse(id: number) {
    try {
      await axios.delete(`${API_URL}/courses/${id}?requesterId=${admin.id}`)
      setReportedCourses(prev => prev.filter(c => c.course_id !== id))
      showToast("Curso excluído")
    } catch (error) {
      console.error(error)
      alert("Erro ao deletar curso")
    }
  }

  async function handleDeleteReview(id: number) {
    try {
      await axios.delete(`${API_URL}/reviews/${id}?requesterId=${admin.id}`)
      setReportedReviews(prev => prev.filter(r => r.review_id !== id))
      showToast("Avaliação excluída")
    } catch (error) {
      console.error(error)
      alert("Erro ao deletar avaliação")
    }
  }

  async function handleDismissReport(reportId: number) {
    try {
      await axios.delete(`${API_URL}/reports/${reportId}?requesterId=${admin.id}`)
      fetchAll()
    } catch (error) {
      console.error(error)
    }
  }

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE))
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE
  )

  const courseReportTotalPages = Math.max(1, Math.ceil(reportedCourses.length / REPORTS_PER_PAGE))
  const paginatedCourseReports = reportedCourses.slice(
    (courseReportPage - 1) * REPORTS_PER_PAGE,
    courseReportPage * REPORTS_PER_PAGE
  )

  const reviewReportTotalPages = Math.max(1, Math.ceil(reportedReviews.length / REPORTS_PER_PAGE))
  const paginatedReviewReports = reportedReviews.slice(
    (reviewReportPage - 1) * REPORTS_PER_PAGE,
    reviewReportPage * REPORTS_PER_PAGE
  )

  function tabButtonClass(value: Tab) {
    const active = tab === value
    return `px-4 py-2.5 rounded-lg cursor-pointer font-bold transition-colors ${
      active
        ? "bg-brand-teal text-white"
        : "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600"
    }`
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />
      <div className="fixed top-0 left-0 w-full h-[70px] bg-brand-teal flex items-center justify-between px-5 box-border z-[1000]">
        <BackButton />
      </div>

      <div className="pt-[100px] px-[30px] pb-[30px] text-gray-900 dark:text-gray-100">

        {/* ABAS */}
        <div className="flex gap-2.5 mb-6">
          <button className={tabButtonClass("courses")} onClick={() => setTab("courses")}>
            Cursos denunciados {reportedCourses.length > 0 && `(${reportedCourses.length})`}
          </button>
          <button className={tabButtonClass("reviews")} onClick={() => setTab("reviews")}>
            Avaliações denunciadas {reportedReviews.length > 0 && `(${reportedReviews.length})`}
          </button>
          <button className={tabButtonClass("users")} onClick={() => setTab("users")}>
            Usuários ({users.length})
          </button>
        </div>

        {tab === "courses" && (
          <div>
            {reportedCourses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Nenhum curso denunciado.</p>
            ) : (
              paginatedCourseReports.map(course => (
                <div key={course.course_id} className={reportCardClass}>
                  <div className="flex justify-between items-center">
                    <strong>{course.title}</strong>
                    <div className="flex gap-2 items-center">
                      <span className="text-red-600 font-bold">{course.report_count} denúncia(s)</span>
                      <button onClick={() => setConfirmingCourse(course)} className={deleteButtonClass}>
                        Deletar curso
                      </button>
                    </div>
                  </div>
                  <ul className="list-disc pl-5">
                    {course.reports.map(r => (
                      <li key={r.id} className="my-1.5">
                        <strong>{r.reason}</strong> — {r.description || "sem detalhes"} <em>({r.username})</em>{" "}
                        <button onClick={() => handleDismissReport(r.id)} className={dismissButtonClass}>
                          Descartar
                        </button>
                      </li>
                    ))}
                    {courseReportTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      disabled={courseReportPage === 1}
                      onClick={() => setCourseReportPage(p => p - 1)}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 disabled:opacity-40 cursor-pointer"
                    >
                      ← Anterior
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Página {courseReportPage} de {courseReportTotalPages}
                    </span>
                    <button
                      disabled={courseReportPage === courseReportTotalPages}
                      onClick={() => setCourseReportPage(p => p + 1)}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 disabled:opacity-40 cursor-pointer"
                    >
                      Próxima →
                    </button>
                  </div>
                )}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div>
            {reportedReviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Nenhuma avaliação denunciada.</p>
            ) : (
              reportedReviews.map(review => (
                <div key={review.review_id} className={reportCardClass}>
                  <div className="flex justify-between items-center">
                    <strong>Curso: {review.course_title}</strong>
                    <div className="flex gap-2 items-center">
                      <span className="text-red-600 font-bold">{review.report_count} denúncia(s)</span>
                      <button onClick={() => setConfirmingReview(review)} className={deleteButtonClass}>
                        Deletar avaliação
                      </button>
                    </div>
                  </div>
                  <p className="italic">"{review.comment}"</p>
                  <ul className="list-disc pl-5">
                    {review.reports.map(r => (
                      <li key={r.id} className="my-1.5">
                        <strong>{r.reason}</strong> — {r.description || "sem detalhes"} <em>({r.username})</em>{" "}
                        <button onClick={() => handleDismissReport(r.id)} className={dismissButtonClass}>
                          Descartar
                        </button>
                      </li>
                    ))}
                    {reviewReportTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      disabled={reviewReportPage === 1}
                      onClick={() => setCourseReportPage(p => p - 1)}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 disabled:opacity-40 cursor-pointer"
                    >
                      ← Anterior
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Página {reviewReportPage} de {reviewReportTotalPages}
                    </span>
                    <button
                      disabled={reviewReportPage === reviewReportTotalPages}
                      onClick={() => setReviewReportPage(p => p + 1)}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700 disabled:opacity-40 cursor-pointer"
                    >
                      Próxima →
                    </button>
                  </div>
                )}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "users" && (
          <div>
            <input
              placeholder="Buscar por nome ou email..."
              value={userSearch}
              onChange={(e) => { setUserSearch(e.target.value); setUserPage(1) }}
              className="w-full max-w-md px-3 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 dark:text-gray-100 mb-4"
            />

            <table className="w-full border-collapse">
              <thead>
                 <tr className="text-left border-b border-gray-300 dark:border-neutral-700">
                  <th className="py-2">Usuário</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Papel</th>
                  <th className="py-2">Denúncias</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-200 dark:border-neutral-800">
                    <td className="py-2">
                      {u.username}
                      {u.total_reports >= MARKED_THRESHOLD && (
                        <span
                          title={`${u.total_reports} denúncias no total`}
                          className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-600 text-white font-bold"
                        >
                          🚩 Marcado
                        </span>
                      )}
                    </td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.role}</td>
                    <td className="py-2">{u.total_reports}</td>
                    <td className="py-2">
                      <button onClick={() => setConfirmingUser(u)} className={deleteButtonClass}>
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 mt-3">Nenhum usuário encontrado.</p>
            )}

            {totalPages > 1 && (
              <div className="flex items-center gap-3 mt-4">
                <button
                  disabled={userPage === 1}
                  onClick={() => setUserPage(p => p - 1)}
                  className="px-3 py-1.5 rounded-md bg-gray-200 dark:bg-neutral-700 disabled:opacity-40 cursor-pointer"
                >
                  ← Anterior
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Página {userPage} de {totalPages}
                </span>
                <button
                  disabled={userPage === totalPages}
                  onClick={() => setUserPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-md bg-gray-200 dark:bg-neutral-700 disabled:opacity-40 cursor-pointer"
                >
                  Próxima →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {confirmingCourse && (
        <ConfirmDeleteModal
          title="Deletar este curso?"
          onCancel={() => setConfirmingCourse(null)}
          onConfirm={() => {
            handleDeleteCourse(confirmingCourse.course_id)
            setConfirmingCourse(null)
          }}
        >
          <strong className="block mb-1">{confirmingCourse.title}</strong>
          <span className="text-sm text-red-600">{confirmingCourse.report_count} denúncia(s)</span>
        </ConfirmDeleteModal>
      )}

      {confirmingUser && (
        <ConfirmDeleteModal
          title="Deletar esta conta?"
          onCancel={() => setConfirmingUser(null)}
          onConfirm={() => {
            handleDeleteUser(confirmingUser.id)
            setConfirmingUser(null)
          }}
        >
          <strong className="block">{confirmingUser.username}</strong>
          <span className="text-sm text-gray-600 dark:text-gray-400">{confirmingUser.email}</span>
          <span className="block text-sm text-gray-600 dark:text-gray-400">Papel: {confirmingUser.role}</span>
        </ConfirmDeleteModal>
      )}

      {confirmingReview && (
        <ConfirmDeleteModal
          title="Deletar esta avaliação?"
          onCancel={() => setConfirmingReview(null)}
          onConfirm={() => {
            handleDeleteReview(confirmingReview.review_id)
            setConfirmingReview(null)
          }}
        >
          <strong className="block mb-1">{confirmingReview.course_title}</strong>
          <StarRating rating={confirmingReview.rating} readOnly size={16} />
          <p className="italic mt-2 mb-0">"{confirmingReview.comment}"</p>
        </ConfirmDeleteModal>
      )}
    </div>
  )
}