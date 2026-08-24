import { useNavigate } from "react-router-dom"

export default function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-green text-white cursor-pointer transition-transform hover:scale-105 active:scale-95 w-fit"
    >
      ← Voltar
    </button>
  )
}