import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate()

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

      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "300px"
        }}
      >

        <h1>Login</h1>

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

        <button type="submit">
          Entrar
        </button>
<p
  style={{
    textAlign: "center"
  }}
>
  Não possui conta?

  <span
    style={{
      marginLeft: "5px"
    }}
  >

    <a href="/register">
      Criar conta
    </a>

  </span>
</p>
      </form>
      

    </div>
    
  )
}