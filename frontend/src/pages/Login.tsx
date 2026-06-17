import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"

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

      alert("Login realizado!")

      navigate("/")

    } catch (error) {
      console.error(error)

      alert("Email ou senha inválidos")
    }
  }



  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5"
    }}>

      <Header
      search={search}
      setSearch={setSearch}
      onOpenFilters={() => {}}
      />

      <div
      style={{
        paddingTop: "120px",
        display:"flex",
        justifyContent:"center"
      }}>
        <form
          onSubmit={handleLogin}
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            display: "flex",
            boxShadow: "0 2px 10px rgba(0,0,0,0,1)",
            flexDirection: "column",
            gap: "15px",
            width: "400px"
          }}
        >

          <h1
            style={{
              color:"#2e7d5a"
            }}
          >
            Login
          </h1>

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

          <button type="submit"
            style={{
              padding:"14px",
              border:"none",
              borderRadius:"10px",
              backgroundColor:"#56c596",
              color:"white",
              fontSize:"16px",
              fontWeight:"bold",
              cursor:"pointer"
            }}
          >
            Entrar
          </button>
          <p
            style={{
            textAlign: "center",
            margin:"0"
            }}
          >
              Não possui conta?

            <Link
              to="/register"
              style={{
                marginLeft:"5px",
                color:"#2e7d5a",
                fontWeight:"bold",
                textDecoration:"none"
              }}
            >
              Criar conta
            </Link>
          </p>
        </form>
      </div>

    </div>
    
  )
}