import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { useToast } from "../context/ToastContext"

const inputClass =
  "px-3 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 dark:text-gray-100"

export default function ForgotPassword() {
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [step, setStep] = useState<"email" | "reset">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.post("http://localhost:3000/users/forgot-password", { email })
      setStep("reset")
    } catch (error) {
      console.error(error)
      alert("Erro ao solicitar recuperação")
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.post("http://localhost:3000/users/reset-password", { email, code, newPassword })
      showToast("Senha redefinida")
      navigate("/login")
    } catch (error) {
      console.error(error)
      alert("Código inválido ou expirado")
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-neutral-900">
      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />

      <div className="pt-[120px] flex justify-center">
        {step === "email" ? (
          <form onSubmit={handleRequestCode} className="bg-white dark:bg-neutral-800 p-[30px] rounded-xl flex flex-col gap-[15px] w-[400px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
            <h1 className="text-brand-dark text-2xl font-bold m-0">Esqueci minha senha</h1>
            <p className="text-gray-600 dark:text-gray-400 m-0">Digite seu email pra receber um código de recuperação.</p>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            <button type="submit" className="p-3.5 border-none rounded-[10px] bg-brand-green text-white font-bold cursor-pointer hover:opacity-90">
              Enviar código
            </button>
            <Link to="/login" className="text-center text-brand-dark font-bold no-underline">Voltar pro login</Link>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="bg-white dark:bg-neutral-800 p-[30px] rounded-xl flex flex-col gap-[15px] w-[400px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
            <h1 className="text-brand-dark text-2xl font-bold m-0">Redefinir senha</h1>
            <input placeholder="Código recebido por email" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} className={`${inputClass} text-center tracking-[6px]`} />
            <input type="password" placeholder="Nova senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
            <button type="submit" className="p-3.5 border-none rounded-[10px] bg-brand-green text-white font-bold cursor-pointer hover:opacity-90">
              Redefinir senha
            </button>
          </form>
        )}
      </div>
    </div>
  )
}