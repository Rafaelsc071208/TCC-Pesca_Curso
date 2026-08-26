import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { useToast } from "../context/ToastContext"

const inputClass =
  "px-3 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 dark:text-gray-100"

export default function Login() {

  const navigate = useNavigate()
  const { showToast } = useToast()

  const [search, setSearch] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [step, setStep] = useState<"credentials" | "code">("credentials")
  const [pendingUserId, setPendingUserId] = useState<number | null>(null)
  const [code, setCode] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await axios.post(
        "http://localhost:3000/users/login",
        { email, password }
      )

      // admin: o backend já devolve o login pronto, sem pedir código
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
        showToast("Login realizado")
        navigate("/")
        return
      }

      // qualquer outro papel: segue pro passo do código de verificação
      setPendingUserId(response.data.userId)
      setStep("code")

    } catch (error) {
      console.error(error)
      alert("Email ou senha inválidos")
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await axios.post(
        "http://localhost:3000/users/verify-2fa",
        { userId: pendingUserId, code }
      )

      localStorage.setItem("user", JSON.stringify(response.data.user))

      showToast("Login realizado")

      navigate("/")

    } catch (error) {
      console.error(error)
      alert("Código inválido ou expirado")
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-neutral-900">

      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />

      <div className="pt-[120px] flex justify-center">

        {step === "credentials" ? (
          <form
            onSubmit={handleLogin}
            className="bg-white dark:bg-neutral-800 p-[30px] rounded-xl flex flex-col gap-[15px] w-[400px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
          >
            <h1 className="text-brand-dark text-2xl font-bold m-0">Login</h1>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />

            <button
              type="submit"
              className="p-3.5 border-none rounded-[10px] bg-brand-green text-white text-base font-bold cursor-pointer hover:opacity-90"
            >
              Entrar
            </button>

            <p className="text-center m-0 text-gray-700 dark:text-gray-300">
              Não possui conta?
              <Link to="/register" className="ml-1.5 text-brand-dark font-bold no-underline">
                Criar conta
              </Link>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyCode}
            className="bg-white dark:bg-neutral-800 p-[30px] rounded-xl flex flex-col gap-[15px] w-[400px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
          >
            <h1 className="text-brand-dark text-2xl font-bold m-0">Verificação</h1>

            <p className="text-gray-600 dark:text-gray-400 m-0">
              Enviamos um código de 6 dígitos pro seu email. Confira sua caixa de entrada (e o spam).
            </p>

            <input
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className={`${inputClass} text-center text-2xl tracking-[8px]`}
            />

            <button
              type="submit"
              className="p-3.5 border-none rounded-[10px] bg-brand-green text-white text-base font-bold cursor-pointer hover:opacity-90"
            >
              Confirmar
            </button>

            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="text-gray-500 dark:text-gray-400 text-sm bg-transparent border-none cursor-pointer"
            >
              ← Voltar e usar outro email
            </button>
          </form>
        )}
      </div>

    </div>
  )
}