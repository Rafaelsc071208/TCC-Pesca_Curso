import { useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import FormField, { fieldStyle } from "../components/FormField"

const API_URL = "http://localhost:3000"

export default function Profile() {
  const [search, setSearch] = useState("")
  const storedUser = JSON.parse(localStorage.getItem("user") || "null")

  const [username, setUsername] = useState(storedUser?.username || "")
  const [email, setEmail] = useState(storedUser?.email || "")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    storedUser?.photo_url ? `${API_URL}${storedUser.photo_url}` : null
  )

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append("username", username)
      formData.append("email", email)
      if (photo) formData.append("photo", photo)

      const response = await axios.put(
        `${API_URL}/users/${storedUser.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      localStorage.setItem("user", JSON.stringify(response.data.user))
      alert("Perfil atualizado!")
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert("Erro ao atualizar perfil")
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()

    try {
      await axios.put(`${API_URL}/users/${storedUser.id}/password`, {
        currentPassword,
        newPassword
      })
      alert("Senha alterada!")
      setCurrentPassword("")
      setNewPassword("")
    } catch (error) {
      console.error(error)
      alert("Senha atual incorreta")
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />

      <div style={{
        paddingTop: "110px",
        paddingBottom: "50px",
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        flexWrap: "wrap"
      }}>

        {/* DADOS DO PERFIL */}
        <form
          onSubmit={handleSaveProfile}
          style={{
            width: "420px",
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            height: "fit-content"
          }}
        >
          <h1 style={{ color: "#2e7d5a", margin: 0 }}>Meu perfil</h1>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <label
              htmlFor="profile-photo"
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: photoPreview ? `url(${photoPreview})` : "#e0e0e0",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "3px solid #56c596",
                fontSize: "13px",
                color: "#777",
                textAlign: "center"
              }}
            >
              {!photoPreview && "Adicionar foto"}
            </label>
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </div>

          <FormField label="Nome de usuário">
            <input style={fieldStyle} value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormField>

          <FormField label="Email">
            <input style={fieldStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>

          <button
            type="submit"
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#56c596",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Salvar alterações
          </button>
        </form>

        {/* TROCAR SENHA */}
        <form
          onSubmit={handleChangePassword}
          style={{
            width: "420px",
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            height: "fit-content"
          }}
        >
          <h1 style={{ color: "#2e7d5a", margin: 0, fontSize: "22px" }}>Alterar senha</h1>

          <FormField label="Senha atual">
            <input
              type="password"
              style={fieldStyle}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </FormField>

          <FormField label="Nova senha">
            <input
              type="password"
              style={fieldStyle}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormField>

          <button
            type="submit"
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#26786e",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Alterar senha
          </button>
        </form>

      </div>
    </div>
  )
}