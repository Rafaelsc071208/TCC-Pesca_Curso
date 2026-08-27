import { ReactNode } from "react"

type Props = {
  title: string
  onConfirm: () => void
  onCancel: () => void
  children: ReactNode
}

export default function ConfirmDeleteModal({ title, onConfirm, onCancel, children }: Props) {
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[3000] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-xl p-6 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-lg font-bold">{title}</h2>

        <div className="bg-gray-100 dark:bg-neutral-900 rounded-lg p-4">
          {children}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-neutral-700 cursor-pointer transition-colors hover:bg-gray-300 dark:hover:bg-neutral-600"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold cursor-pointer transition-colors hover:bg-red-700"
          >
            Sim, deletar
          </button>
        </div>
      </div>
    </div>
  )
}