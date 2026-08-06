type Props = {
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
const ratings = [5, 4, 3, 2, 1]

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

  function categoryButtonStyle(value: string): React.CSSProperties {
    const active = selectedCategory === value
    return {
      width: "100%",
      padding: "10px 16px",
      border: active ? "2px solid white" : "2px solid transparent",
      borderRadius: "8px",
      background: active ? "#1c5b53" : "#26786e",
      color: "white",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: active ? "bold" : "normal",
      textAlign: "left",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }

  function ratingButtonStyle(value: number): React.CSSProperties {
    const active = selectedMinRating === value
    return {
      width: "100%",
      padding: "10px 16px",
      border: active ? "2px solid white" : "2px solid transparent",
      borderRadius: "8px",
      background: active ? "#1c5b53" : "#26786e",
      color: "white",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: active ? "bold" : "normal",
      textAlign: "left",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }

  return (
    <div style={{
      position: "fixed",
      right: 0,
      top: 0,
      width: "270px",
      height: "100%",
      background: "#4fb5a8",
      color: "white",
      padding: "20px",
      overflowY: "auto",
      zIndex: 999
    }}>
      <button
        onClick={onClose}
        style={{
          width: "100%",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          background: "#26786e",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "20px"
        }}
      >
        Fechar
      </button>

      <h2>Preço</h2>

      <input
        type="number"
        placeholder="Preço mínimo"
        value={minPrice === 0 ? "" : minPrice}
        onChange={(e) => setMinPrice(e.target.value === "" ? 0 : Number(e.target.value))}
        style={{
          width: "100%", padding: "10px", border: "none", borderRadius: "8px",
          marginBottom: "10px", background: "#26786e", color: "white", fontSize: "15px",
          boxSizing: "border-box"
        }}
      />

      <input
        type="number"
        placeholder="Preço máximo"
        value={maxPrice === 999999 ? "" : maxPrice}
        onChange={(e) => setMaxPrice(e.target.value === "" ? 999999 : Number(e.target.value))}
        style={{
          width: "100%", padding: "10px", border: "none", borderRadius: "8px",
          marginBottom: "20px", background: "#26786e", color: "white", fontSize: "15px",
          boxSizing: "border-box"
        }}
      />

      <h2>Categoria</h2>

      <button style={categoryButtonStyle("")} onClick={() => setSelectedCategory("")}>
        Todos {selectedCategory === "" && "✓"}
      </button>

      {categories.map(cat => (
        <button key={cat} style={categoryButtonStyle(cat)} onClick={() => setSelectedCategory(cat)}>
          {cat} {selectedCategory === cat && "✓"}
        </button>
      ))}

      <h2 style={{ marginTop: "20px" }}>Avaliação mínima</h2>

      <button style={ratingButtonStyle(0)} onClick={() => setSelectedMinRating(0)}>
        Todas {selectedMinRating === 0 && "✓"}
      </button>

      {ratings.map(r => (
        <button key={r} style={ratingButtonStyle(r)} onClick={() => setSelectedMinRating(r)}>
          {"★".repeat(r)}{"☆".repeat(5 - r)} ou mais {selectedMinRating === r && "✓"}
        </button>
      ))}
    </div>
  )
}