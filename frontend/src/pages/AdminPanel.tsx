import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"

const API_URL = "http://localhost:3000"

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

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [reportedCourses, setReportedCourses] = useState<ReportedCourse[]>([])
  const [reportedReviews, setReportedReviews] = useState<ReportedReview[]>([])
  const [search, setSearch] = useState("")

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

  return (
    <div>
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />
      <div style={{ paddingTop: "100px", padding: "100px 30px 30px", display: "flex", flexDirection: "column", gap: "40px" }}>

        <div>
          <h1>Cursos denunciados</h1>
          {reportedCourses.length === 0 ? (
            <p style={{ color: "#888" }}>Nenhum curso denunciado.</p>
          ) : (
            reportedCourses.map(course => (
              <div key={course.course_id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: "10px", padding: "16px", marginBottom: "14px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{course.title}</strong>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ color: "red", fontWeight: "bold" }}>{course.report_count} denúncia(s)</span>
                    <button onClick={() => handleDeleteCourse(course.course_id)} style={{ background: "red", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                      Deletar curso
                    </button>
                  </div>
                </div>
                <ul>
                  {course.reports.map(r => (
                    <li key={r.id} style={{ margin: "6px 0" }}>
                      <strong>{r.reason}</strong> — {r.description || "sem detalhes"} <em>({r.username})</em>{" "}
                      <button onClick={() => handleDismissReport(r.id)} style={{ marginLeft: "8px", fontSize: "12px", cursor: "pointer" }}>
                        Descartar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div>
          <h1>Avaliações denunciadas</h1>
          {reportedReviews.length === 0 ? (
            <p style={{ color: "#888" }}>Nenhuma avaliação denunciada.</p>
          ) : (
            reportedReviews.map(review => (
              <div key={review.review_id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: "10px", padding: "16px", marginBottom: "14px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>Curso: {review.course_title}</strong>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ color: "red", fontWeight: "bold" }}>{review.report_count} denúncia(s)</span>
                    <button onClick={() => handleDeleteReview(review.review_id)} style={{ background: "red", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                      Deletar avaliação
                    </button>
                  </div>
                </div>
                <p style={{ fontStyle: "italic" }}>"{review.comment}"</p>
                <ul>
                  {review.reports.map(r => (
                    <li key={r.id} style={{ margin: "6px 0" }}>
                      <strong>{r.reason}</strong> — {r.description || "sem detalhes"} <em>({r.username})</em>{" "}
                      <button onClick={() => handleDismissReport(r.id)} style={{ marginLeft: "8px", fontSize: "12px", cursor: "pointer" }}>
                        Descartar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div>
          <h1>Usuários</h1>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr><th>Usuário</th><th>Email</th><th>Papel</th><th></th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td><button onClick={() => handleDeleteUser(u.id)}>Deletar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}