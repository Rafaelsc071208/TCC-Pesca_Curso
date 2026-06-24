import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

import Header from "../components/Header"

export default function Register() {

  const navigate = useNavigate()

  const [search, setSearch] = useState("")

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [role, setrole] = useState("user")

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
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5"
      }}
    >

      {/* HEADER */}
      <Header
        search={search}
        setSearch={setSearch}
        onOpenFilters={() => {}}
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
            
            style={{
              padding:"12px",
              borderRadius:"8px",
              border:"1px solid #ccc"
            }}
          />



          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}

            style={{
              padding:"12px",
              borderRadius:"8px",
              border:"1px solid #ccc"
            }}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              padding:"12px",
              borderRadius:"8px",
              border:"1px solid #ccc"
            }}
          >
            <option value="user">Aluno</option>
            <option value="institution">Instituição</option>
          </select>


          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}

            style={{
              padding:"12px",
              borderRadius:"8px",
              border:"1px solid #ccc"
            }}
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
          <p
            style={{
              textAlign:"center",
              margin:"0"
            }}
          >
            Já tem uma conta?

            <Link
              to="/login"
              style={{
                marginLeft:"5px",
                color:"#2e7d5a",
                fontWeight:"bold",
                textDecoration:"none"
              }}
            >
             Entrar 
            </Link>  
          </p>
        </form>

      </div>

    </div>
  )
}