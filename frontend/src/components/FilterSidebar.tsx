type Props = {
  open: boolean

  selectedCategory: string
  setSelectedCategory: (value: string) => void

  minPrice: number
  maxPrice: number
  setMinPrice: (value: number) => void
  setMaxPrice: (value: number) => void

  selectedMinRating: number
  setSelectedMinRating: (value: number) => void

  onClose: () => void
}

const categories = ["Presencial", "Online", "Misto"]

const inputClass =
  "w-full px-2.5 py-2.5 rounded-lg border-none bg-brand-teal text-white text-[15px] box-border transition-colors focus:outline-none focus:ring-2 focus:ring-white/60"

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedMinRating,
  setSelectedMinRating,
  onClose
}: Props) {

  function categoryButtonClass(value: string) {
    const active = selectedCategory === value
    return `w-full px-4 py-2.5 rounded-lg mb-2 flex items-center justify-between text-left text-[15px] cursor-pointer transition-colors duration-150 ${
      active
        ? "border-2 border-white bg-brand-teal-dark font-bold"
        : "border-2 border-transparent bg-brand-teal font-normal hover:bg-brand-teal-dark"
    }`
  }

  return (
    <>
      {/* fundo escurecido, fecha ao clicar fora */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-[998] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* painel de filtros, desliza a partir da direita */}
      <div
        className={`fixed right-0 top-0 w-[270px] h-full bg-brand-mint text-white p-5 overflow-y-auto z-[999]
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={onClose}
          className="w-full px-5 py-2.5 rounded-lg border-none bg-brand-teal text-white cursor-pointer text-base mb-5 transition-colors hover:bg-brand-teal-dark"
        >
          Fechar
        </button>

        <h2 className="text-lg font-bold">Preço</h2>

        <input
          type="number"
          placeholder="Preço mínimo"
          value={minPrice === 0 ? "" : minPrice}
          onChange={(e) => setMinPrice(e.target.value === "" ? 0 : Number(e.target.value))}
          className={`${inputClass} mb-2.5`}
        />

        <input
          type="number"
          placeholder="Preço máximo"
          value={maxPrice === 999999 ? "" : maxPrice}
          onChange={(e) => setMaxPrice(e.target.value === "" ? 999999 : Number(e.target.value))}
          className={`${inputClass} mb-5`}
        />

        <h2 className="text-lg font-bold">Categoria</h2>

        <button className={categoryButtonClass("")} onClick={() => setSelectedCategory("")}>
          Todos {selectedCategory === "" && "✓"}
        </button>

        {categories.map(cat => (
          <button key={cat} className={categoryButtonClass(cat)} onClick={() => setSelectedCategory(cat)}>
            {cat} {selectedCategory === cat && "✓"}
          </button>
        ))}

        <h2 className="text-lg font-bold mt-5">Avaliação mínima</h2>

        <select
          value={selectedMinRating}
          onChange={(e) => setSelectedMinRating(Number(e.target.value))}
          className={inputClass}
        >
          <option value={0}>Todas as avaliações</option>
          <option value={5}>★★★★★</option>
          <option value={4}>★★★★☆ ou mais</option>
          <option value={3}>★★★☆☆ ou mais</option>
          <option value={2}>★★☆☆☆ ou mais</option>
          <option value={1}>★☆☆☆☆ ou mais</option>
        </select>
      </div>
    </>
  )
}
