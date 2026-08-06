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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 p-6 rounded-xl w-[380px] max-w-[90%] flex flex-col gap-3.5"
      >
        <h3 className="m-0 text-lg font-bold">
          {targetType === "course" ? "Denunciar curso" : "Denunciar avaliação"}
        </h3>

        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="px-2.5 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 dark:text-gray-100"
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
          className="px-2.5 py-2.5 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 dark:text-gray-100 font-sans resize-y"
        />

        <div className="flex gap-2.5 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border-none bg-gray-200 dark:bg-neutral-600 dark:text-gray-100 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg border-none bg-red-600 text-white cursor-pointer hover:bg-red-700"
          >
            Enviar denúncia
          </button>
        </div>
      </form>
    </div>
  )
}
