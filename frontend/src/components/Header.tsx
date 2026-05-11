

type Props = {
  search: string
  setSearch: (value: string) => void
}

export default function Header({
  search,
  setSearch
}: Props) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      width: "100%",
      height: "60px",
      background: "#a8e6cf",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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