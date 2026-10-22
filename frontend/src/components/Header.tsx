import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import ProfileMenu from "./ProfileMenu"
import logoUrl from "../assets/Logo.svg"
import iconUrl from "../assets/Icon.svg"

type Props = {
  search: string
  setSearch: (value: string) => void
  onOpenFilters: () => void
  searchMode?: "courses" | "institutions"
  setSearchMode?: (value: "courses" | "institutions") => void
}

export default function Header({
  search,
  setSearch,
  onOpenFilters,
  searchMode,
  setSearchMode
}: Props) {

  const { theme, toggleTheme } = useTheme()

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  )

return (
  <div className="fixed top-0 left-0 w-full bg-brand-teal z-[1000] px-3 md:px-5 py-2 md:py-0 md:h-[70px] flex flex-col md:flex-row md:items-center gap-2 md:gap-0">

    {/* Contêiner centralizado */}
    <div className="w-full flex flex-col md:flex-row items-center justify-between md:justify-center gap-4">

      {/* Logo */}
      <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
        <img src={logoUrl} alt="Cursos" className="h-8 md:h-10 w-auto" />
      </Link>

      {/* Barra de pesquisa */}
      <div className="w-full md:w-2/5 flex items-center gap-2">
        {setSearchMode && (
          <select
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as "courses" | "institutions")}
            className="rounded-[20px] border-none bg-brand-dark text-white px-2 py-2.5 md:py-3 text-sm cursor-pointer shrink-0"
          >
            <option value="courses">Cursos</option>
            <option value="institutions">Instituições</option>
          </select>
        )}

        <div className="relative flex-1">
          <img
            src={iconUrl}
            alt=""
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 md:h-5 w-auto pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cursos..."
            className="w-full pl-9 md:pl-10 pr-3 py-2.5 md:py-3 rounded-[20px] border-none bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-mint transition-shadow text-sm md:text-base"
          />
        </div>

        <button
          onClick={onOpenFilters}
          className="w-10 h-10 md:w-[45px] md:h-[45px] rounded-[10px] bg-brand-green text-white cursor-pointer text-lg md:text-xl font-bold transition-transform hover:scale-105 hover:brightness-110 active:scale-95 shrink-0"
        >
          ☰
        </button>
      </div>

      {/* Botões à direita */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-brand-dark text-white cursor-pointer text-lg transition-transform hover:scale-110 hover:brightness-110 active:scale-95"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {user ? (
          <>
            {user.isAdmin === 1 && (
              <Link to="/admin">
                <button className="px-[18px] py-2.5 rounded-[10px] bg-brand-dark text-white font-bold cursor-pointer transition-colors hover:bg-brand-teal-dark">
                  Painel Admin
                </button>
              </Link>
            )}

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
          <Link to="/login">
            <button className="px-4 py-2.5 rounded-lg bg-brand-green text-white cursor-pointer transition-transform hover:scale-105 hover:brightness-110 active:scale-95">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  </div>
)
}