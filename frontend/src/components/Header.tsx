import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import ProfileMenu from "./ProfileMenu"
import logoUrl from "../assets/Logo.svg"
import iconUrl from "../assets/Icon.svg"

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

  return (
    <div className="fixed top-0 left-0 w-full h-[70px] bg-brand-teal flex items-center justify-between px-5 box-border z-[1000]">

      {/* LOGO */}
      <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
        <img src={logoUrl} alt="Cursos" className="h-10 w-auto" />
      </Link>

      {/* PESQUISA */}
      <div className="w-2/5 flex items-center gap-2">
        <div className="relative flex-1">
          <img
            src={iconUrl}
            alt=""
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-auto pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cursos..."
            className="w-full pl-10 pr-3 py-3 rounded-[20px] border-none bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-mint transition-shadow"
          />
        </div>

        <button
          onClick={onOpenFilters}
          className="w-[45px] h-[45px] rounded-[10px] bg-brand-green text-white cursor-pointer text-xl font-bold transition-transform hover:scale-105 hover:brightness-110 active:scale-95"
        >
          ☰
        </button>
      </div>

      {/* DIREITA */}
      <div className="flex items-center gap-2.5">

        {/* DARK MODE */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-brand-dark text-white cursor-pointer text-lg transition-transform hover:scale-110 hover:brightness-110 active:scale-95"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {user ? (
          <>
            {/* ADMIN */}
            {user.isAdmin === 1 && (
              <Link to="/admin">
                <button className="px-[18px] py-2.5 rounded-[10px] bg-brand-dark text-white font-bold cursor-pointer transition-colors hover:bg-brand-teal-dark">
                  Painel Admin
                </button>
              </Link>
            )}

            {/* CRIAR CURSO (só para instituição) */}
            {user.role === "institution" && (
              <Link to="/create-course">
                <button className="px-[18px] py-2.5 rounded-[10px] bg-brand-dark text-white font-bold cursor-pointer transition-colors hover:bg-brand-teal-dark">
                  + Criar Curso
                </button>
              </Link>
            )}

            <ProfileMenu user={user} />
          </>

        ) : (
          // NÃO LOGADO
          <Link to="/login">
            <button className="px-4 py-2.5 rounded-lg bg-brand-green text-white cursor-pointer transition-transform hover:scale-105 hover:brightness-110 active:scale-95">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
