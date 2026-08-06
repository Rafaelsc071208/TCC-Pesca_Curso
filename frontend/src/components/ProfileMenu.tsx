import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const API_URL = "http://localhost:3000"

type Props = {
  user: any
}

export default function ProfileMenu({ user }: Props) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLogout() {
    localStorage.removeItem("user")
    navigate("/")
    window.location.reload()
  }

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          border: "2px solid white",
          background: user.photo_url ? `url(${API_URL}${user.photo_url})` : "#2e7d5a",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {!user.photo_url && (user.username?.[0]?.toUpperCase() || "?")}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "52px",
            right: 0,
            width: "220px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            overflow: "hidden",
            zIndex: 1100
          }}
        >
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #eee" }}>
            <strong style={{ display: "block", color: "#222" }}>{user.username}</strong>
            <span style={{ fontSize: "13px", color: "#888" }}>{user.email}</span>
          </div>

          <MenuLink to="/profile" onClick={() => setOpen(false)}>Meu perfil</MenuLink>

          {user.role === "user" && (
            <>
              <MenuLink to="/favorites" onClick={() => setOpen(false)}>Cursos favoritados</MenuLink>
              <MenuLink to="/my-reviews" onClick={() => setOpen(false)}>Minhas avaliações</MenuLink>
            </>
          )}

          {user.role === "institution" && (
            <MenuLink to="/institution" onClick={() => setOpen(false)}>Meus cursos</MenuLink>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              border: "none",
              background: "white",
              color: "red",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Deslogar
          </button>
        </div>
      )}
    </div>
  )
}

function MenuLink({
  to,
  children,
  onClick
}: {
  to: string
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: "block",
        padding: "12px 16px",
        color: "#222",
        textDecoration: "none",
        fontSize: "14px",
        borderBottom: "1px solid #f5f5f5"
      }}
    >
      {children}
    </Link>
  )
}