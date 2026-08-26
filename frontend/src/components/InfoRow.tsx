type Props = {
  icon: string
  label: string
  value?: string | number | null
}

export default function InfoRow({ icon, label, value }: Props) {
  if (!value) return null

  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/10 last:border-0">
      <span className="text-lg leading-none">{icon}</span>
      <div>
        <span className="block text-xs uppercase tracking-wide text-white/60">{label}</span>
        <span className="block text-white">{value}</span>
      </div>
    </div>
  )
}