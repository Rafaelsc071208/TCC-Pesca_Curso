import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import Header from "../components/Header"
import BackButton from "../components/BackButton"
import FormField, { fieldClass } from "../components/FormField"
import { useToast } from "../context/ToastContext"

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
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
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

        // "08:00 às 10:00" volta pros dois campos de horário
        if (course.period) {
          const parts = course.period.split(" às ")
          setStartTime(parts[0] || "")
          setEndTime(parts[1] || "")
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
        period: startTime && endTime ? `${startTime} às ${endTime}` : "",
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
                <select className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                  <option value="Misto">Misto</option>
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
                <select className={fieldClass} value={modality} onChange={(e) => setModality(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="Curso técnico">Curso técnico</option>
                  <option value="Curso livre">Curso livre</option>
                  <option value="Graduação">Graduação</option>
                  <option value="Pós-graduação">Pós-graduação</option>
                  <option value="Profissionalizante">Profissionalizante</option>
                </select>
              </FormField>

              <FormField label="Forma de pagamento">
                <select className={fieldClass} value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="Gratuito">Gratuito</option>
                  <option value="Mensalidade">Mensalidade</option>
                  <option value="Pagamento único">Pagamento único</option>
                  <option value="Bolsa parcial">Bolsa parcial</option>
                  <option value="Bolsa integral">Bolsa integral</option>
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Horário de início">
                <input type="time" className={fieldClass} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </FormField>

              <FormField label="Horário de término">
                <input type="time" className={fieldClass} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
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