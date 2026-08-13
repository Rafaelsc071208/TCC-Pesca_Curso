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
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          backgroundImage: user.photo_url ? `url(${API_URL}${user.photo_url})` : undefined
        }}
        className={`w-[42px] h-[42px] rounded-full border-2 border-white/70 bg-cover bg-center
          text-white text-base font-bold cursor-pointer flex items-center justify-center transition-transform hover:scale-105
          ${user.photo_url ? "" : "bg-brand-dark"}`}
      >
        {!user.photo_url && (user.username?.[0]?.toUpperCase() || "?")}
      </button>

      {open && (
        <div className="absolute top-[52px] right-0 w-[220px] bg-white dark:bg-neutral-800 rounded-[10px] shadow-lg overflow-hidden z-[1100]">
          <div className="px-4 py-3.5 border-b border-gray-200 dark:border-neutral-700">
            <strong className="block text-gray-900 dark:text-gray-100">{user.username}</strong>
            <span className="text-[13px] text-gray-500 dark:text-gray-400">{user.email}</span>
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
            className="w-full text-left px-4 py-3 border-none bg-gray-100 dark:bg-neutral-700 text-red-600 cursor-pointer text-sm"
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
      className="block px-4 py-3 text-gray-900 dark:text-gray-100 no-underline text-sm border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
    >
      {children}
    </Link>
  )
}
