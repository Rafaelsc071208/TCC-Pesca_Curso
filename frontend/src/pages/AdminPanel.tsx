import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"

type User = {
  id: number
  username: string
  email: string
  isAdmin: number
  role: string
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")

  const admin = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {
    axios
      .get(`http://localhost:3000/users?requesterId=${admin.id}`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
  }, [])

  async function handleDeleteUser(id: number) {
    if (!confirm("Tem certeza que deseja deletar esta conta?")) return

    try {
      await axios.delete(`http://localhost:3000/users/${id}?requesterId=${admin.id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (error) {
      console.error(error)
      alert("Erro ao deletar usuário")
    }
  }

  return (
    <div>
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />
      <div style={{ paddingTop: "100px", padding: "100px 30px 30px" }}>
        <h1>Painel de Administrador</h1>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Usuário</th><th>Email</th><th>Papel</th><th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => handleDeleteUser(u.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}