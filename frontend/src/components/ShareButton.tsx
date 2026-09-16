import { useToast } from "../context/ToastContext"

type Props = {
  title: string
  url: string
}

export default function ShareButton({ title, url }: Props) {
  const { showToast } = useToast()

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // usuário cancelou o compartilhamento, não faz nada
      }
    } else {
      await navigator.clipboard.writeText(url)
      showToast("Link copiado!")
    }
  }

  return (
    <button
      onClick={handleShare}
      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-neutral-700"
    >
      🔗 Compartilhar
    </button>
  )
}