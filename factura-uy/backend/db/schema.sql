-- ============================================================
-- Factura-UY — Schema SQLite
-- DGI Uruguay CFE versión 23-2
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ── Empresa (fila única — configuración del emisor) ────────
CREATE TABLE IF NOT EXISTS empresa (
  id                 INTEGER PRIMARY KEY DEFAULT 1,
  ruc                TEXT    NOT NULL,
  razon_social       TEXT    NOT NULL,
  nombre_comercial   TEXT,
  domicilio_fiscal   TEXT    NOT NULL DEFAULT '',
  ciudad             TEXT    NOT NULL DEFAULT '',
  departamento       TEXT    NOT NULL DEFAULT 'Montevideo',
  codigo_actividad   TEXT    NOT NULL DEFAULT '6201',
  email_empresa      TEXT,
  telefono           TEXT,
  logo_path          TEXT,
  moneda_default     TEXT    NOT NULL DEFAULT 'UYU',
  -- DGI
  ambiente           TEXT    NOT NULL DEFAULT 'mock',  -- mock|homologacion|produccion
  dgi_usuario        TEXT,
  dgi_password_enc   TEXT,
  -- SMTP (opcional, para envío de email)
  smtp_host          TEXT,
  smtp_port          INTEGER DEFAULT 587,
  smtp_user          TEXT,
  smtp_pass_enc      TEXT,
  smtp_from          TEXT,
  -- Metadatos
  created_at         TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT    NOT NULL DEFAULT (datetime('now')),
  CHECK (id = 1)  -- solo un registro
);

-- ── Clientes / Proveedores ─────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo             TEXT    NOT NULL DEFAULT 'cliente', -- cliente|proveedor|ambos
  tipo_doc         TEXT    NOT NULL DEFAULT 'RUT',     -- RUT|CI|Pasaporte|Otro
  documento        TEXT    NOT NULL,
  razon_social     TEXT    NOT NULL,
  nombre_comercial TEXT,
  domicilio        TEXT,
  ciudad           TEXT,
  departamento     TEXT,
  pais             TEXT    NOT NULL DEFAULT 'UY',
  email            TEXT,
  telefono         TEXT,
  exento_iva       INTEGER NOT NULL DEFAULT 0,  -- boolean
  notas            TEXT,
  created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_clientes_documento    ON clientes(documento);
CREATE INDEX IF NOT EXISTS idx_clientes_razon_social ON clientes(razon_social);

-- ── Rangos CAE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cae_sequences (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo_cfe          INTEGER NOT NULL,    -- 101,102,103,111,112,113,124,182
  serie             TEXT    NOT NULL DEFAULT 'A',
  numero_desde      INTEGER NOT NULL,
  numero_hasta      INTEGER NOT NULL,
  numero_siguiente  INTEGER NOT NULL,
  fecha_vencimiento TEXT    NOT NULL,
  estado            TEXT    NOT NULL DEFAULT 'activo', -- activo|agotado|vencido
  xml_cae           TEXT,                -- XML CAE original de DGI
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cae_tipo ON cae_sequences(tipo_cfe, estado);

-- ── Certificados digitales ─────────────────────────────────
CREATE TABLE IF NOT EXISTS certificados (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  thumbprint     TEXT    NOT NULL UNIQUE,
  subject_cn     TEXT    NOT NULL,
  not_before     TEXT    NOT NULL,
  not_after      TEXT    NOT NULL,
  cert_pem_enc   TEXT    NOT NULL,  -- PEM encriptado AES-256
  key_pem_enc    TEXT    NOT NULL,  -- Private key PEM encriptado
  activo         INTEGER NOT NULL DEFAULT 1,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── CFE (Comprobantes Fiscales Electrónicos) ───────────────
CREATE TABLE IF NOT EXISTS cfe (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Identificación
  tipo_cfe           INTEGER NOT NULL,   -- 101,102,103,111,112,113,124,182
  serie              TEXT    NOT NULL DEFAULT 'A',
  numero             INTEGER,            -- NULL hasta emitir
  -- Receptor
  cliente_id         INTEGER REFERENCES clientes(id),
  receptor_nombre    TEXT    NOT NULL DEFAULT '',
  receptor_doc_tipo  TEXT    NOT NULL DEFAULT 'RUT',
  receptor_doc       TEXT,
  receptor_email     TEXT,
  receptor_domicilio TEXT,
  -- Fechas
  fecha_emision      TEXT    NOT NULL DEFAULT (date('now')),
  fecha_vencimiento  TEXT,
  -- Moneda
  moneda             TEXT    NOT NULL DEFAULT 'UYU',
  tipo_cambio        REAL    NOT NULL DEFAULT 1.0,
  -- Importes (en moneda del documento)
  monto_neto         REAL    NOT NULL DEFAULT 0,
  monto_iva_22       REAL    NOT NULL DEFAULT 0,
  monto_iva_10       REAL    NOT NULL DEFAULT 0,
  monto_exento       REAL    NOT NULL DEFAULT 0,
  monto_total        REAL    NOT NULL DEFAULT 0,
  -- Estado
  estado             TEXT    NOT NULL DEFAULT 'borrador', -- borrador|emitido|rechazado|anulado
  -- Medio de pago (obligatorio CFE v23-2 desde 3/3/2026)
  medio_pago         TEXT    NOT NULL DEFAULT 'efectivo',
  -- DGI
  cae_id             INTEGER REFERENCES cae_sequences(id),
  dgi_response_code  TEXT,
  dgi_response_msg   TEXT,
  dgi_timestamp      TEXT,
  xml_sin_firma      TEXT,   -- XML antes de firmar
  xml_firmado        TEXT,   -- XML firmado enviado a DGI
  -- Referencia (para notas de crédito/débito)
  referencia_cfe_id  INTEGER REFERENCES cfe(id),
  referencia_motivo  TEXT,
  -- PDF
  pdf_path           TEXT,
  enviado_email      INTEGER NOT NULL DEFAULT 0,
  -- Observaciones
  notas              TEXT,
  -- Metadatos
  created_at         TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cfe_tipo    ON cfe(tipo_cfe);
CREATE INDEX IF NOT EXISTS idx_cfe_estado  ON cfe(estado);
CREATE INDEX IF NOT EXISTS idx_cfe_fecha   ON cfe(fecha_emision);
CREATE INDEX IF NOT EXISTS idx_cfe_cliente ON cfe(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cfe_numero  ON cfe(tipo_cfe, serie, numero);

-- ── Líneas de CFE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cfe_items (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  cfe_id          INTEGER NOT NULL REFERENCES cfe(id) ON DELETE CASCADE,
  orden           INTEGER NOT NULL DEFAULT 1,
  descripcion     TEXT    NOT NULL,
  cantidad        REAL    NOT NULL DEFAULT 1,
  precio_unitario REAL    NOT NULL DEFAULT 0,
  tasa_iva        INTEGER NOT NULL DEFAULT 22,  -- 22, 10, o 0 (exento)
  descuento_pct   REAL    NOT NULL DEFAULT 0,
  monto_item      REAL    NOT NULL DEFAULT 0,   -- neto sin IVA
  monto_iva_item  REAL    NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_items_cfe ON cfe_items(cfe_id);

-- ── Trigger: updated_at automático ────────────────────────
CREATE TRIGGER IF NOT EXISTS trg_empresa_upd
  AFTER UPDATE ON empresa
  BEGIN UPDATE empresa SET updated_at = datetime('now') WHERE id = NEW.id; END;

CREATE TRIGGER IF NOT EXISTS trg_clientes_upd
  AFTER UPDATE ON clientes
  BEGIN UPDATE clientes SET updated_at = datetime('now') WHERE id = NEW.id; END;

CREATE TRIGGER IF NOT EXISTS trg_cfe_upd
  AFTER UPDATE ON cfe
  BEGIN UPDATE cfe SET updated_at = datetime('now') WHERE id = NEW.id; END;
