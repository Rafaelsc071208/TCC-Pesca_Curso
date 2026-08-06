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
    <div className="flex gap-1">
      {stars.map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onRate && onRate(star)}
          style={{ fontSize: `${size}px` }}
          className={`leading-none select-none ${
            star <= rating ? "text-amber-400" : "text-gray-300 dark:text-neutral-600"
          } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}
