import { useState } from "react"
import axios from "axios"

type Props = {
  targetType: "course" | "review"
  targetId: number
  onClose: () => void
}

const courseReasons = [
  "Informação falsa ou enganosa",
  "Conteúdo ofensivo ou impróprio",
  "Possível golpe ou fraude",
  "Curso duplicado",
  "Spam",
  "Outro"
]

const reviewReasons = [
  "Ofensiva ou discurso de ódio",
  "Spam ou propaganda",
  "Avaliação falsa",
  "Informação pessoal exposta",
  "Outro"
]

export default function ReportModal({ targetType, targetId, onClose }: Props) {
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const user = JSON.parse(localStorage.getItem("user") || "null")

  const reasons = targetType === "course" ? courseReasons : reviewReasons

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user) {
      alert("Faça login para denunciar")
      return
    }

    if (!reason) {
      alert("Selecione um motivo")
      return
    }

    try {
      await axios.post("http://localhost:3000/reports", {
        target_type: targetType,
        target_id: targetId,
        user_id: user.id,
        reason,
        description
      })

      alert("Denúncia enviada. Nossa equipe vai analisar.")
      onClose()
    } catch (error) {
      console.error(error)
      alert("Erro ao enviar denúncia")
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          padding: "24px",
          borderRadius: "12px",
          width: "380px",
          maxWidth: "90%",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <h3 style={{ margin: 0 }}>
          {targetType === "course" ? "Denunciar curso" : "Denunciar avaliação"}
        </h3>

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option value="">Selecione o motivo</option>
          {reasons.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <textarea
          placeholder="Conte mais detalhes (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontFamily: "inherit", resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "10px 16px", border: "none", borderRadius: "8px", background: "#ddd", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{ padding: "10px 16px", border: "none", borderRadius: "8px", background: "red", color: "white", cursor: "pointer" }}
          >
            Enviar denúncia
          </button>
        </div>
      </form>
    </div>
  )
}