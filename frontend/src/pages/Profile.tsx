import { useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import FormField, { fieldClass } from "../components/FormField"

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
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />

      <div className="pt-[110px] pb-[50px] flex justify-center gap-6 flex-wrap">

        {/* DADOS DO PERFIL */}
        <form
          onSubmit={handleSaveProfile}
          className="w-[420px] h-fit bg-white dark:bg-neutral-800 p-[30px] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] flex flex-col gap-[18px]"
        >
          <h1 className="text-brand-dark text-2xl font-bold m-0">Meu perfil</h1>

          <div className="flex flex-col items-center gap-2.5">
            <label
              htmlFor="profile-photo"
              style={{
                backgroundImage: photoPreview ? `url(${photoPreview})` : undefined
              }}
              className={`w-[90px] h-[90px] rounded-full bg-cover bg-center flex items-center
                justify-center cursor-pointer border-[3px] border-brand-green text-[13px]
                text-gray-500 text-center ${photoPreview ? "" : "bg-gray-200 dark:bg-neutral-700"}`}
            >
              {!photoPreview && "Adicionar foto"}
            </label>
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          <FormField label="Nome de usuário">
            <input className={fieldClass} value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormField>

          <FormField label="Email">
            <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>

          <button
            type="submit"
            className="p-3.5 border-none rounded-[10px] bg-brand-green text-white font-bold cursor-pointer hover:opacity-90"
          >
            Salvar alterações
          </button>
        </form>

        {/* TROCAR SENHA */}
        <form
          onSubmit={handleChangePassword}
          className="w-[420px] h-fit bg-white dark:bg-neutral-800 p-[30px] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] flex flex-col gap-[18px]"
        >
          <h1 className="text-brand-dark text-[22px] font-bold m-0">Alterar senha</h1>

          <FormField label="Senha atual">
            <input
              type="password"
              className={fieldClass}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </FormField>

          <FormField label="Nova senha">
            <input
              type="password"
              className={fieldClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormField>

          <button
            type="submit"
            className="p-3.5 border-none rounded-[10px] bg-brand-teal text-white font-bold cursor-pointer hover:opacity-90"
          >
            Alterar senha
          </button>
        </form>

      </div>
    </div>
  )
}
