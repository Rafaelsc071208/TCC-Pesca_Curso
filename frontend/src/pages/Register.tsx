import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import Header from "../components/Header"

export default function Register() {

  const navigate = useNavigate()

  const [search, setSearch] = useState("")

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")



  async function handleRegister(e: React.FormEvent) {

    e.preventDefault()

    try {

      await axios.post(
        "http://localhost:3000/users/register",
        {
          username,
          email,
          password
        }
      )

      alert("Conta criada!")

      navigate("/login")

    } catch (error) {

      console.error(error)

      alert("Erro ao criar conta")
    }
  }



  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5"
      }}
    >

      {/* HEADER */}
      <Header
        search={search}
        setSearch={setSearch}
      />



      {/* FORM */}
      <div
        style={{
          paddingTop: "120px",
          display: "flex",
          justifyContent: "center"
        }}
      >

        <form
          onSubmit={handleRegister}
          style={{
            width: "400px",
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
        >

          <h1
            style={{
              color: "#2e7d5a"
            }}
          >
            Criar Conta
          </h1>



          <input
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />



          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />



          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />



          <button
            type="submit"
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#56c596",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Criar Conta
          </button>

        </form>

      </div>

    </div>
  )
}