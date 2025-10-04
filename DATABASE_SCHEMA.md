# Database Schema - Raffle App

## Tables

### `links`

Almacena los links únicos generados para cada comprador.

```sql
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  opportunities INTEGER NOT NULL CHECK (opportunities IN (2, 4, 6, 8, 10)),
  remaining INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ NOT NULL,
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX idx_links_token ON links(token);
CREATE INDEX idx_links_active_expires ON links(active, expires_at);
```

**Campos:**
- `id`: UUID único del link
- `token`: Token aleatorio usado en la URL (ej: `abc123def456`)
- `opportunities`: Cantidad de números que puede seleccionar (2, 4, 6, 8 o 10)
- `remaining`: Números restantes que puede seleccionar
- `active`: Si el link está activo (se desactiva cuando `remaining = 0`)
- `expires_at`: Fecha de expiración (30 minutos desde creación)
- `buyer_name`, `buyer_email`, `buyer_phone`: Datos del comprador
- `created_at`: Timestamp de creación

---

### `purchases`

Registra cada número de la rifa que fue comprado.

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Evitar que el mismo número se venda dos veces
  UNIQUE(number)
);

-- Índices
CREATE INDEX idx_purchases_link_id ON purchases(link_id);
CREATE INDEX idx_purchases_number ON purchases(number);
```

**Campos:**
- `id`: UUID único de la compra
- `link_id`: Referencia al link que compró este número
- `number`: Número de la rifa (formato: "000" a "999")
- `created_at`: Timestamp de la compra

**Constraint importante:** `UNIQUE(number)` garantiza que ningún número se venda dos veces.

---

## Row Level Security (RLS)

Si deseas habilitar RLS para mayor seguridad:

```sql
-- Habilitar RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer links activos
CREATE POLICY "Anyone can read active links"
  ON links FOR SELECT
  USING (active = true AND expires_at > NOW());

-- Política: Solo service role puede modificar
CREATE POLICY "Service role can modify links"
  ON links FOR ALL
  USING (auth.role() = 'service_role');

-- Política: Cualquiera puede leer purchases (para ver números vendidos)
CREATE POLICY "Anyone can read purchases"
  ON purchases FOR SELECT
  USING (true);

-- Política: Solo service role puede insertar purchases
CREATE POLICY "Service role can insert purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
```

---

## Funciones SQL Útiles

### Verificar disponibilidad de números

```sql
-- Ver cuántos números quedan disponibles
SELECT COUNT(*) as available
FROM generate_series(0, 999) AS num
WHERE NOT EXISTS (
  SELECT 1 FROM purchases 
  WHERE number = LPAD(num::TEXT, 3, '0')
);
```

### Ver estadísticas de la rifa

```sql
-- Estadísticas generales
SELECT 
  (SELECT COUNT(*) FROM links) as total_links,
  (SELECT COUNT(*) FROM links WHERE active = true) as active_links,
  (SELECT COUNT(*) FROM purchases) as numbers_sold,
  (1000 - (SELECT COUNT(*) FROM purchases)) as numbers_available;
```

### Limpiar links expirados

```sql
-- Marcar como inactivos los links expirados
UPDATE links
SET active = false
WHERE active = true
  AND expires_at < NOW();
```

---

## Migraciones

Para crear las tablas en Supabase:

1. Ir a **SQL Editor** en Supabase Dashboard
2. Ejecutar el siguiente SQL:

```sql
-- Habilitar extensión UUID (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla links
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  opportunities INTEGER NOT NULL CHECK (opportunities IN (2, 4, 6, 8, 10)),
  remaining INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ NOT NULL,
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_links_token ON links(token);
CREATE INDEX IF NOT EXISTS idx_links_active_expires ON links(active, expires_at);

-- Tabla purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(number)
);

CREATE INDEX IF NOT EXISTS idx_purchases_link_id ON purchases(link_id);
CREATE INDEX IF NOT EXISTS idx_purchases_number ON purchases(number);
```

---

## Testing

### Insertar datos de prueba

```sql
-- Crear un link de prueba
INSERT INTO links (token, opportunities, remaining, expires_at)
VALUES ('test123', 4, 4, NOW() + INTERVAL '30 minutes');

-- Comprar algunos números
INSERT INTO purchases (link_id, number)
SELECT id, '000' FROM links WHERE token = 'test123'
UNION ALL
SELECT id, '001' FROM links WHERE token = 'test123';

-- Actualizar remaining
UPDATE links
SET remaining = remaining - 2
WHERE token = 'test123';
```

### Limpiar datos de prueba

```sql
DELETE FROM links WHERE token = 'test123';
-- Las purchases se eliminan automáticamente por CASCADE
```
