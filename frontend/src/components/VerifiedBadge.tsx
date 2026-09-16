import badgeUrl from "../assets/verified-badge.png"

export default function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <img
      src={badgeUrl}
      alt="Instituição verificada"
      title="Instituição verificada"
      style={{ width: size, height: size }}
      className="inline-block ml-1"
    />
  )
}