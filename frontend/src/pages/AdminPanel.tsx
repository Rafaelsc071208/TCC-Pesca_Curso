import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import { useToast } from "../context/ToastContext"
import BackButton from "../components/BackButton"

const API_URL = "http://localhost:3000"
const USERS_PER_PAGE = 10

type User = {
  id: number
  username: string
  email: string
  isAdmin: number
  role: string
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

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("courses")

  const [users, setUsers] = useState<User[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [userPage, setUserPage] = useState(1)

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
    if (!confirm("Tem certeza que deseja deletar esta conta?")) return
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
    if (!confirm("Deletar este curso?")) return
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
    if (!confirm("Deletar esta avaliação?")) return
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
              reportedCourses.map(course => (
                <div key={course.course_id} className={reportCardClass}>
                  <div className="flex justify-between items-center">
                    <strong>{course.title}</strong>
                    <div className="flex gap-2 items-center">
                      <span className="text-red-600 font-bold">{course.report_count} denúncia(s)</span>
                      <button onClick={() => handleDeleteCourse(course.course_id)} className={deleteButtonClass}>
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
                      <button onClick={() => handleDeleteReview(review.review_id)} className={deleteButtonClass}>
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
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-200 dark:border-neutral-800">
                    <td className="py-2">{u.username}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.role}</td>
                    <td className="py-2">
                      <button onClick={() => handleDeleteUser(u.id)} className={deleteButtonClass}>
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
    </div>
  )
}