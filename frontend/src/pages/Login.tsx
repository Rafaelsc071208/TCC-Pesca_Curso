import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"

const inputClass =
  "px-3 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 dark:text-gray-100"

export default function Login() {

  const navigate = useNavigate()

  const [search, setSearch] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")



  async function handleLogin(e: React.FormEvent) {

    e.preventDefault()

    try {

      const response = await axios.post(
        "http://localhost:3000/users/login",
        {
          email,
          password
        }
      )

      // salva usuário
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      )

      if (response.data.user.role === "institution") {
        navigate("/institution")
      }
      else {
        navigate("/")
      }

      alert("Login realizado!")

    } catch (error) {
      console.error(error)

      alert("Email ou senha inválidos")
    }
  }



  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-neutral-900">

      <Header
        search={search}
        setSearch={setSearch}
        onOpenFilters={() => {}}
      />

      <div className="pt-[120px] flex justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-neutral-800 p-[30px] rounded-xl flex flex-col gap-[15px] w-[400px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
        >

          <h1 className="text-brand-dark text-2xl font-bold m-0">
            Login
          </h1>

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
            <Link
              to="/register"
              className="ml-1.5 text-brand-dark font-bold no-underline"
            >
              Criar conta
            </Link>
          </p>
        </form>
      </div>

    </div>

  )
}
