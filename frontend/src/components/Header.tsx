import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import ProfileMenu from "./ProfileMenu"

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
      <Link to="/" className="no-underline text-white font-bold text-2xl">
        Cursos
      </Link>

      {/* PESQUISA */}
      <div className="w-2/5 flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cursos..."
          className="flex-1 px-3 py-3 rounded-[20px] border-none"
        />

        <button
          onClick={onOpenFilters}
          className="w-[45px] h-[45px] rounded-[10px] bg-brand-green text-white cursor-pointer text-xl font-bold"
        >
          ☰
        </button>
      </div>

      {/* DIREITA */}
      <div className="flex items-center gap-2.5">

        {/* DARK MODE */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-brand-dark text-white cursor-pointer text-lg"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {user ? (
          <>
            {/* ADMIN */}
            {user.isAdmin === 1 && (
              <Link to="/admin">
                <button className="px-[18px] py-2.5 rounded-[10px] bg-brand-dark text-white font-bold cursor-pointer">
                  Painel Admin
                </button>
              </Link>
            )}

            {/* CRIAR CURSO (só para instituição) */}
            {user.role === "institution" && (
              <Link to="/create-course">
                <button className="px-[18px] py-2.5 rounded-[10px] bg-brand-dark text-white font-bold cursor-pointer">
                  + Criar Curso
                </button>
              </Link>
            )}

            <ProfileMenu user={user} />
          </>

        ) : (
          // NÃO LOGADO
          <Link to="/login">
            <button className="px-4 py-2.5 rounded-lg bg-brand-green text-white cursor-pointer">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
