import { ReactNode } from "react"

type Props = {
  label: string
  children: ReactNode
}

export default function FormField({ label, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-brand-dark">
        {label}
      </label>
      {children}
    </div>
  )
}

// classe padrão de input/select/textarea, usada nos formulários do site
export const fieldClass =
  "w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 " +
  "bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 text-[15px] font-sans"
