import { ReactNode } from "react"

type Props = {
  label: string
  children: ReactNode
}

export default function FormField({ label, children }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d5a" }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export const fieldStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontFamily: "inherit",
  fontSize: "15px",
  width: "100%",
  boxSizing: "border-box"
}