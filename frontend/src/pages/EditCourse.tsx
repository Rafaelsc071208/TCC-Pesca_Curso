import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import Header from "../components/Header"
import BackButton from "../components/BackButton"
import FormField, { fieldClass } from "../components/FormField"
import { useToast } from "../context/ToastContext"
import { CATEGORY_OPTIONS, MODALITY_OPTIONS, PERIOD_OPTIONS, PAYMENT_TYPE_OPTIONS } from "../constants/courseOptions"

const API_URL = "http://localhost:3000"

export default function EditCourse() {

  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState("")
  const [institutionName, setInstitutionName] = useState("")
  const [modality, setModality] = useState("")
  const [paymentType, setPaymentType] = useState("")
  const [location, setLocation] = useState("")
  const [periods, setPeriods] = useState<string[]>([])

  function togglePeriod(option: string) {
    setPeriods(prev =>
      prev.includes(option) ? prev.filter(p => p !== option) : [...prev, option]
    )
  }
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [link, setLink] = useState("")
  const [descriptionDet, setDescriptionDet] = useState("")
  const [endereco, setEndereco] = useState("")

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // carrega os dados atuais do curso e preenche o formulário
  useEffect(() => {
    axios
      .get(`${API_URL}/courses/${id}`)
      .then(response => {
        const course = response.data

        setTitle(course.title || "")
        setInstitutionName(course.institution_name || "")
        setModality(course.modality || "")
        setPaymentType(course.payment_type || "")
        setLocation(course.location || "")
        setDuration(course.duration || "")
        setDescription(course.description || "")
        setCategory(course.category || "")
        setPrice(String(course.price || ""))
        setLink(course.link || "")
        setDescriptionDet(course.description_det || "")
        setEndereco(course.endereco || "")

        if (course.periods) {
          try {
            setPeriods(JSON.parse(course.periods))
          } catch {
            setPeriods([])
          }
        }

        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        alert("Curso não encontrado")
        navigate("/")
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const confirmed = window.confirm("Salvar as alterações desse curso?")
    if (!confirmed) return

    try {
      await axios.put(`${API_URL}/courses/${id}`, {
        requesterId: user.id,
        title,
        description,
        category,
        link,
        endereco,
        institution_name: institutionName,
        modality,
        payment_type: paymentType,
        location,
        periods: JSON.stringify(periods),
        duration,
        price,
        description_det: descriptionDet
      })

      showToast("Curso atualizado")
      navigate(`/course/${id}`)
    } catch (error) {
      console.error(error)
      alert("Erro ao atualizar o curso")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
        <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />
        <p className="pt-[130px] md:pt-[90px] px-6 text-gray-900 dark:text-gray-100">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">

      <Header search={search} setSearch={setSearch} onOpenFilters={() => {}} />

      <div className="pt-[130px] md:pt-[90px] pb-[50px] flex flex-col items-center gap-4">

        <div className="w-[700px] max-w-[90%]">
          <BackButton />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-[700px] max-w-[90%] bg-white dark:bg-neutral-800 p-[35px] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] flex flex-col gap-7"
        >
          <div>
            <h1 className="text-brand-dark text-2xl font-bold m-0">Editar Curso</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 mb-0">
              Altere as informações que precisam ser atualizadas.
            </p>
          </div>

          {/* INFORMAÇÕES BÁSICAS */}
          <div className="flex flex-col gap-4">
            <h3 className="m-0 pb-2 border-b-2 border-gray-100 dark:border-neutral-700 text-gray-900 dark:text-gray-100 text-lg font-bold">
              Informações básicas
            </h3>

            <FormField label="Título do curso">
              <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormField>

            <FormField label="Descrição curta">
              <input className={fieldClass} value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormField>

            <FormField label="Descrição detalhada">
              <textarea
                className={`${fieldClass} resize-y`}
                value={descriptionDet}
                onChange={(e) => setDescriptionDet(e.target.value)}
                rows={5}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Categoria">
                <select
                  className={fieldClass}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Preço mensal (R$)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={fieldClass}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {/* INSTITUIÇÃO E MODALIDADE */}
          <div className="flex flex-col gap-4">
            <h3 className="m-0 pb-2 border-b-2 border-gray-100 dark:border-neutral-700 text-gray-900 dark:text-gray-100 text-lg font-bold">
              Instituição e modalidade
            </h3>

            <FormField label="Nome da instituição">
              <input className={fieldClass} value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Modalidade">
                <select
                  className={fieldClass}
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {MODALITY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Forma de pagamento">
                <select
                  className={fieldClass}
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {PAYMENT_TYPE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Períodos oferecidos (selecione um ou mais)">
                <div className="grid grid-cols-2 gap-2">
                  {PERIOD_OPTIONS.map(option => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-neutral-700 rounded-lg px-3 py-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={periods.includes(option)}
                        onChange={() => togglePeriod(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </FormField>
            </div>

            <FormField label="Duração">
              <input className={fieldClass} value={duration} onChange={(e) => setDuration(e.target.value)} />
            </FormField>

            <FormField label="Localização">
              <input className={fieldClass} value={location} onChange={(e) => setLocation(e.target.value)} />
            </FormField>

            <FormField label="Endereço completo (se presencial)">
              <input className={fieldClass} value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            </FormField>
          </div>

          {/* LINK */}
          <div className="flex flex-col gap-4">
            <h3 className="m-0 pb-2 border-b-2 border-gray-100 dark:border-neutral-700 text-gray-900 dark:text-gray-100 text-lg font-bold">
              Link
            </h3>

            <FormField label="Link externo do curso">
              <input className={fieldClass} value={link} onChange={(e) => setLink(e.target.value)} />
            </FormField>
          </div>

          <button
            type="submit"
            className="p-4 border-none rounded-[10px] bg-brand-green text-white text-[17px] font-bold cursor-pointer hover:opacity-90"
          >
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  )
}