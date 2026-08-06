import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

type Props = {
  search: string
  setSearch: (value: string) => void
  onOpenFilters: () => void
}

export default function Header({
  search,
  setSearch,
  onOpenFilters
}: Props) {

  const { theme, toggleTheme } = useTheme()

  // pega usuário logado
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  )

  // logout
  function handleLogout() {
    localStorage.removeItem("user")
    window.location.reload()
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        left: 0,
        height: "70px",
        background: "#26786e",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxSizing: "border-box",
        zIndex: 1000
      }}
    >

      {/* LOGO */}
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "24px"
        }}
      >
        Cursos
      </Link>

      {/* PESQUISA */}
      <div
        style={{
          width: "40%",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cursos..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "20px",
            border: "none"
          }}
        />

        <button
          onClick={onOpenFilters}
          style={{
            width: "45px",
            height: "45px",
            border: "none",
            borderRadius: "10px",
            background: "#56c596",
            color: "white",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "bold"
          }}
        >
          ☰
        </button>
      </div>

      {/* DIREITA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        {/* DARK MODE */}
        <button
          onClick={toggleTheme}
          style={{
            width: "40px",
            height: "40px",
            border: "none",
            borderRadius: "50%",
            background: "#2e7d5a",
            color: "white",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {user ? (
          <>
            {/* ADMIN */}
            {user.isAdmin === 1 && (
              <Link to="/admin">
                <button
                  style={{
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#2e7d5a",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Painel Admin
                </button>
              </Link>
            )}

            {/* CRIAR CURSO (só para instituição) */}
            {user.role === "institution" && (
              <Link to="/create-course">
                <button
                  style={{
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#2e7d5a",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  + Criar Curso
                </button>
              </Link>
            )}

            {/* NOME */}
            <span
              style={{
                fontWeight: "bold",
                color: "#ffffff"
              }}
            >
              {user.username}
            </span>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                background: "red",
                color: "white",
                cursor: "pointer"
              }}
            >
              Sair
            </button>
          </>
        ) : (
          // NÃO LOGADO
          <Link to="/login">
            <button
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                background: "#56c596",
                color: "white",
                cursor: "pointer"
              }}
            >
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}