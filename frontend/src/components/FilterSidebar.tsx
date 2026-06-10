type Props = {
  setSelectedCategory: (value: string) => void

  minPrice: number
  maxPrice: number

  setMinPrice: (value: number) => void
  setMaxPrice: (value: number) => void

  onClose: () => void
}

export default function FilterSidebar({
  setSelectedCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  onClose
}: Props) {
  return (
    <div style={{
      position: "fixed",
      right: 0,
      top: 0,
      width: "250px",
      height: "100%",
      background: "#4fb5a8",
      color: "white",
      padding: "20px"
    }}>
      <button onClick={onClose}
             style={{
              width: "30%",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#26786e",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              textAlign: "center"
            }}>
        Fechar
      </button>

      <h2>Filtros</h2>

      <input
        type="number"
        placeholder="Preço mínimo"
        value={minPrice === 0 ? "" : minPrice}
        onChange={(e) =>
          setMinPrice(
            e.target.value === ""
            ? 0
            : Number(e.target.value)
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          border: "none",
          borderRadius: "8px",
          marginBottom: "10px",
          background: "#26786e",
          color: "white",
          fontSize: "15px"
        }}
      />

      <input
        type="number"
        placeholder="Preço máximo"
        value={maxPrice === 999999 ? "" : maxPrice}
        onChange={(e) =>
          setMaxPrice(
            e.target.value === ""
              ? 999999
              : Number(e.target.value)
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          border: "none",
          borderRadius: "8px",
          marginBottom: "20px",
          background: "#26786e",
          color: "white",
          fontSize: "15px"
        }}
      />

      <button onClick={() => setSelectedCategory("")}
        style={{
              width: "50%",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#26786e",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}>
        Todos
      </button>
<br />
<br />      <button onClick={() => setSelectedCategory("Presencial")}
        style={{
              width: "50%",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#26786e",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}>
        Presencial
      </button>
<br />
<br />  
      <button onClick={() => setSelectedCategory("Online")}
        style={{
              width: "50%",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#26786e",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}>
        Online
      </button>
<br />
<br />
      <button onClick={() => setSelectedCategory("Misto")}
        style={{
              width: "50%",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#26786e",
              color: "white",
              cursor: "pointer",
              fontSize: "16px"
            }}>
        Misto
      </button>
    </div>
  )
}