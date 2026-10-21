import { CATEGORY_OPTIONS, MODALITY_OPTIONS, PERIOD_OPTIONS, PAYMENT_TYPE_OPTIONS } from "../constants/courseOptions"

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

  userLocation: { lat: number, lng: number } | null
  radiusKm: number
  setRadiusKm: (value: number) => void
  locationDenied: boolean
  onRequestLocation: () => void

  selectedModality: string
  setSelectedModality: (value: string) => void

  selectedPaymentType: string
  setSelectedPaymentType: (value: string) => void

  selectedPeriod: string
  setSelectedPeriod: (value: string) => void

  onClose: () => void
}

const inputClass =
  "w-full px-2.5 py-2.5 rounded-lg border-none bg-brand-teal text-white text-[15px] box-border transition-colors focus:outline-none focus:ring-2 focus:ring-white/60"

export default function FilterSidebar({
  open,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedMinRating,
  setSelectedMinRating,
  userLocation,
  radiusKm,
  setRadiusKm,
  locationDenied,
  onRequestLocation,
  selectedModality,
  setSelectedModality,
  selectedPaymentType,
  setSelectedPaymentType,
  selectedPeriod,
  setSelectedPeriod,
  onClose
}: Props) {

  return (
    <>
      {/* fundo escurecido, fecha ao clicar fora */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-[1050] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* painel de filtros, desliza a partir da direita */}
      <div
        className={`fixed right-0 top-0 w-[270px] h-full bg-brand-mint text-white p-5 overflow-y-auto hide-scrollbar z-[1100]
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >

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

        <h2 className="text-lg font-bold flex items-center gap-2">🏷️ Categoria</h2>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={inputClass}
        >
          <option value="">Todas</option>
          {CATEGORY_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <h2 className="text-lg font-bold flex items-center gap-2">🎓 Modalidade</h2>

        <select
          value={selectedModality}
          onChange={(e) => setSelectedModality(e.target.value)}
          className={inputClass}
        >
          <option value="">Todas</option>
          {MODALITY_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <h2 className="text-lg font-bold flex items-center gap-2">Forma de pagamento</h2>

        <select
          value={selectedPaymentType}
          onChange={(e) => setSelectedPaymentType(e.target.value)}
          className={inputClass}
        >
          <option value="">Todas</option>
          {PAYMENT_TYPE_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <h2 className="text-lg font-bold flex items-center gap-2">🕒 Período</h2>

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className={inputClass}
        >
          <option value="">Qualquer período</option>
          {PERIOD_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <h2 className="text-lg font-bold flex items-center gap-2"> Localização</h2>

        {!userLocation ? (
          <button
            onClick={onRequestLocation}
            className="w-full px-4 py-2.5 rounded-lg bg-brand-teal text-white cursor-pointer transition-colors hover:bg-brand-teal-dark"
          >
            📍 Ativar minha localização
          </button>
        ) : (
          <>
            <p className="text-sm text-white/80 mb-2"> Localização ativa</p>

            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className={inputClass}
            >
              <option value={0}>Qualquer distância</option>
              <option value={5}>Até 5 km</option>
              <option value={10}>Até 10 km</option>
              <option value={25}>Até 25 km</option>
              <option value={50}>Até 50 km</option>
            </select>
          </>
        )}

        {locationDenied && (
          <p className="text-sm text-white/80 mt-2">
            Não foi possível acessar sua localização. Verifique a permissão do navegador.
          </p>
        )}

        <h2 className="text-lg font-bold flex items-center gap-2"> Avaliação mínima</h2>

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
