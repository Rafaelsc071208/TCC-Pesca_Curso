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
      style={{ height }}
      className="relative w-full rounded-[10px] overflow-hidden bg-gray-300 dark:bg-neutral-700"
    >
      {hasImages ? (
        <img
          src={`${API_URL}${images[index]}`}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
          Sem imagem
        </div>
      )}

      {showArrows && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-1.5 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white text-lg leading-none cursor-pointer"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-1.5 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white text-lg leading-none cursor-pointer"
          >
            ›
          </button>
        </>
      )}

      {hasImages && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full inline-block ${
                i === index ? "bg-brand-teal" : "bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
