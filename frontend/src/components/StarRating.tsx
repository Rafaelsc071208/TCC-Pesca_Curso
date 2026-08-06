type Props = {
  rating: number
  onRate?: (value: number) => void
  size?: number
  readOnly?: boolean
}

export default function StarRating({
  rating,
  onRate,
  size = 22,
  readOnly = false
}: Props) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {stars.map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onRate && onRate(star)}
          style={{
            fontSize: `${size}px`,
            color: star <= rating ? "#f5b301" : "#d0d0d0",
            cursor: readOnly ? "default" : "pointer",
            lineHeight: 1,
            userSelect: "none"
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}