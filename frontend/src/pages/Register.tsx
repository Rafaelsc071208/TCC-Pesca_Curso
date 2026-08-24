import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "../context/ToastContext"

import Header from "../components/Header"

const inputClass =
  "px-3 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 dark:text-gray-100"

export default function Register() {

  const navigate = useNavigate()

  const { showToast } = useToast()

  const [search, setSearch] = useState("")

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [role, setRole] = useState("user")

  async function handleRegister(e: React.FormEvent) {

    e.preventDefault()

    try {

      await axios.post(
        "http://localhost:3000/users/register",
        {
          username,
          email,
          password,
          role
        }
      )

      showToast("Conta criada")

      navigate("/login")

    } catch (error) {

      console.error(error)

      alert("Erro ao criar conta")
    }
  }



  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-neutral-900">

      {/* HEADER */}
      <Header
        search={search}
        setSearch={setSearch}
        onOpenFilters={() => {}}
      />

      {/* FORM */}
      <div className="pt-[120px] flex justify-center">

        <form
          onSubmit={handleRegister}
          className="w-[400px] bg-white dark:bg-neutral-800 p-[30px] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex flex-col gap-[15px]"
        >

          <h1 className="text-brand-dark text-2xl font-bold m-0">
            Criar Conta
          </h1>

          <input
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClass}
          >
            <option value="user">Aluno</option>
            <option value="institution">Instituição</option>
          </select>

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
            Criar Conta
          </button>

          <p className="text-center m-0 text-gray-700 dark:text-gray-300">
            Já tem uma conta?
            <Link
              to="/login"
              className="ml-1.5 text-brand-dark font-bold no-underline"
            >
              Entrar
            </Link>
          </p>
        </form>

      </div>

    </div>
  )
}
