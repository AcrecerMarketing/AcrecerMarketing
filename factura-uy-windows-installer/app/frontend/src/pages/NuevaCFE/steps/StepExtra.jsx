export default function StepExtra({ form, update }) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Datos adicionales</h3>
      <div className="form-row cols-2">
        <div className="form-group">
          <label>Fecha de emisión</label>
          <input type="date" value={form.fecha_emision} onChange={e => update({ fecha_emision: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Fecha de vencimiento (opcional)</label>
          <input type="date" value={form.fecha_vencimiento} onChange={e => update({ fecha_vencimiento: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Medio de pago <span title="Obligatorio desde CFE v23-2">ℹ️</span></label>
          <select value={form.medio_pago} onChange={e => update({ medio_pago: e.target.value })}>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="debito">Tarjeta de débito</option>
            <option value="credito">Tarjeta de crédito</option>
            <option value="cheque">Cheque</option>
            <option value="otros">Otros</option>
          </select>
        </div>
        <div className="form-group">
          <label>Moneda</label>
          <select value={form.moneda} onChange={e => update({ moneda: e.target.value })}>
            <option value="UYU">Peso Uruguayo (UYU)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        {form.moneda !== 'UYU' && (
          <div className="form-group">
            <label>Tipo de cambio (a UYU)</label>
            <input type="number" min="0" step="0.01" value={form.tipo_cambio} onChange={e => update({ tipo_cambio: +e.target.value })} />
          </div>
        )}
        {[102, 103, 112, 113].includes(form.tipo_cfe) && (
          <>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Motivo de la nota de crédito/débito</label>
              <input value={form.referencia_motivo} onChange={e => update({ referencia_motivo: e.target.value })} placeholder="Ej: Devolución de mercadería, error en precio…" />
            </div>
          </>
        )}
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label>Observaciones internas (no aparece en el comprobante)</label>
          <textarea value={form.notas} onChange={e => update({ notas: e.target.value })} rows={3} placeholder="Notas internas…" style={{ resize: 'vertical' }} />
        </div>
      </div>
    </div>
  )
}
