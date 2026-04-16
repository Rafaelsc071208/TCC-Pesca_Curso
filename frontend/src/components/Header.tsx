export default function Header() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      width: "100%",
      height: "60px",
      background: "#a8e6cf",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <input
        placeholder="Buscar cursos..."
        style={{
          width: "40%",
          padding: "10px",
          borderRadius: "20px",
          border: "none"
        }}
      />
    </div>
  )
}