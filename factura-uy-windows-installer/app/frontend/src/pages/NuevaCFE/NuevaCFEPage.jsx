import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'
import StepTipoDoc from './steps/StepTipoDoc'
import StepReceptor from './steps/StepReceptor'
import StepItems from './steps/StepItems'
import StepExtra from './steps/StepExtra'
import StepPreview from './steps/StepPreview'

const STEPS = ['Tipo', 'Receptor', 'Ítems', 'Extras', 'Confirmar']

export default function NuevaCFEPage() {
  const nav = useNavigate()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    tipo_cfe: null,
    serie: 'A',
    cliente_id: null,
    receptor_nombre: '',
    receptor_doc_tipo: 'RUT',
    receptor_doc: '',
    receptor_email: '',
    receptor_domicilio: '',
    fecha_emision: new Date().toISOString().split('T')[0],
    fecha_vencimiento: '',
    moneda: 'UYU',
    tipo_cambio: 1,
    medio_pago: 'efectivo',
    referencia_cfe_id: null,
    referencia_motivo: '',
    notas: '',
    items: [],
  })

  const update = (data) => setForm(f => ({ ...f, ...data }))

  const handleEmitir = async () => {
    setLoading(true)
    try {
      // 1. Crear borrador
      const cfe = await api.post('/cfe', form)
      // 2. Emitir
      const emitido = await api.post(`/cfe/${cfe.id}/emitir`)
      if (emitido.estado === 'emitido') {
        toast(`✅ CFE emitido correctamente\nSerie ${emitido.serie}-${emitido.numero}`, 'ok')
      } else {
        toast(`⚠️ CFE rechazado por DGI:\n${emitido.dgi_response_msg}`, 'err', 6000)
      }
      nav(`/historial/${cfe.id}`)
    } catch (e) {
      toast(`Error: ${e.error || e.message || 'Error al emitir'}`, 'err')
    } finally {
      setLoading(false)
    }
  }

  const canNext = () => {
    if (step === 0) return !!form.tipo_cfe
    if (step === 2) return form.items.length > 0
    return true
  }

  return (
    <div>
      <div className="topbar">
        <h2>Nueva CFE</h2>
      </div>
      <div className="page">
        {/* Barra de pasos */}
        <div className="steps-bar">
          {STEPS.map((s, i) => (
            <div key={i} className={`step-item${i === step ? ' active' : i < step ? ' done' : ''}`}>
              <span className="step-num">{i < step ? '✓' : i + 1}</span>
              {s}
            </div>
          ))}
        </div>

        {/* Contenido de cada paso */}
        <div className="card">
          {step === 0 && <StepTipoDoc form={form} update={update} />}
          {step === 1 && <StepReceptor form={form} update={update} />}
          {step === 2 && <StepItems form={form} update={update} />}
          {step === 3 && <StepExtra form={form} update={update} />}
          {step === 4 && <StepPreview form={form} />}
        </div>

        {/* Navegación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button className="btn btn-secondary" onClick={() => step === 0 ? nav('/historial') : setStep(s => s - 1)}>
            {step === 0 ? '← Cancelar' : '← Atrás'}
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
              Siguiente →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleEmitir} disabled={loading}>
              {loading ? 'Emitiendo…' : '🚀 Emitir CFE'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
