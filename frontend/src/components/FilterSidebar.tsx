export default function FilterSidebar({ onClose }: any) {
  return (
    <div style={{
      position: "fixed",
      right: 0,
      top: 0,
      width: "300px",
      height: "100%",
      background: "#2e7d5a",
      color: "white",
      padding: "20px",
      zIndex: 1000
     
    }}>
      <button onClick={onClose}
       style={{
    padding: "10px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#fff",
    color: "#2e7d5a",
    cursor: "pointer",
    marginBottom: "20px"
  }}
>Fechar</button>
      <h2>Filtros</h2>
    </div>
  )
}