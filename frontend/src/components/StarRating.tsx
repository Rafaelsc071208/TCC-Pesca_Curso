type Props = {
  rating: number
  onRate?: (value: number) => void
  size?: number
  readOnly?: boolean
  allowZero?: boolean
  precise?: boolean // se true, mostra fração de estrela (ex: 3.43) em vez de arredondar
}

export default function StarRating({
  rating,
  onRate,
  size = 22,
  readOnly = false,
  allowZero = false,
  precise = false
}: Props) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-1">
      {stars.map(star => {
        const fillPercent = precise
          ? Math.max(0, Math.min(1, rating - (star - 1))) * 100
          : star <= rating ? 100 : 0

        return (
          <span
            key={star}
            onClick={() => !readOnly && onRate && onRate(star)}
            style={{ fontSize: `${size}px`, position: "relative", display: "inline-block" }}
            className={`leading-none select-none ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          >
            <span className="text-gray-300 dark:text-neutral-600">★</span>
            <span
              className="absolute inset-0 overflow-hidden text-amber-400"
              style={{ width: `${fillPercent}%` }}
            >
              ★
            </span>
          </span>
        )
      })}

      {!readOnly && allowZero && (
        <button
          type="button"
          onClick={() => onRate && onRate(0)}
          className={`ml-2 text-xs px-2 py-1 rounded-md border ${
            rating === 0
              ? "bg-red-600 text-white border-red-600"
              : "border-gray-300 dark:border-neutral-600 text-gray-500 dark:text-gray-400"
          }`}
        >
          0 estrelas
        </button>
      )}
    </div>
  )
}