import { useState } from "react"

type Props = {
  images: string[]
  height?: string
}

const API_URL = "http://localhost:3000"

export default function ImageCarousel({ images, height = "180px" }: Props) {
  const [index, setIndex] = useState(0)
  const [hovering, setHovering] = useState(false)

  const hasImages = images && images.length > 0
  const showArrows = hasImages && images.length > 1 && hovering

  function prev(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIndex(i => (i === 0 ? images.length - 1 : i - 1))
  }

  function next(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIndex(i => (i === images.length - 1 ? 0 : i + 1))
  }

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: "10px",
        overflow: "hidden",
        background: "#d9d9d9"
      }}
    >
      {hasImages ? (
        <img
          src={`${API_URL}${images[index]}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#777"
        }}>
          Sem imagem
        </div>
      )}

      {showArrows && (
        <>
          <button onClick={prev} style={arrowStyle("left")}>‹</button>
          <button onClick={next} style={arrowStyle("right")}>›</button>
        </>
      )}

      {hasImages && images.length > 1 && (
        <div style={{
          position: "absolute",
          bottom: "8px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "6px"
        }}>
          {images.map((_, i) => (
            <span
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i === index ? "#26786e" : "#ffffffaa",
                display: "inline-block"
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function arrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    [side]: "6px",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.4)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    fontSize: "18px",
    cursor: "pointer",
    lineHeight: 1
  }
}