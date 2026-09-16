import { useEffect, useState } from "react"
import axios from "axios"
import { useToast } from "../context/ToastContext"

const API_URL = "http://localhost:3000"

type VerificationRequest = {
  id: number
  status: "pending" | "approved" | "rejected"
}

export default function RequestVerification() {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const { showToast } = useToast()
  const [status, setStatus] = useState<VerificationRequest | null>(null)
  const [file, setFile] = useState<File | null>(null)

  function fetchStatus() {
    axios.get(`${API_URL}/verification/mine/${user.id}`)
      .then(res => setStatus(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => { fetchStatus() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return alert("Selecione um documento")

    try {
      const formData = new FormData()
      formData.append("user_id", String(user.id))
      formData.append("document", file)

      await axios.post(`${API_URL}/verification`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      showToast("Solicitação enviada")
      fetchStatus()
    } catch (error) {
      console.error(error)
      alert("Erro ao enviar solicitação")
    }
  }

  if (status?.status === "approved") {
    return <p className="text-green-600 font-bold">✓ Sua instituição já está verificada!</p>
  }

  if (status?.status === "pending") {
    return <p className="text-gray-600 dark:text-gray-400">Sua solicitação está em análise.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      {status?.status === "rejected" && (
        <p className="text-red-600">Sua última solicitação foi rejeitada. Envie um novo documento.</p>
      )}
      <p className="text-gray-600 dark:text-gray-400">
        Envie um documento que comprove que sua instituição é real (ex: CNPJ, alvará de funcionamento).
      </p>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button type="submit" className="px-4 py-2.5 rounded-lg bg-brand-green text-white font-bold cursor-pointer w-fit">
        Enviar para análise
      </button>
    </form>
  )
}