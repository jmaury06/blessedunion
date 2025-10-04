-- ============================================
-- 🧹 SCRIPT PARA LIMPIAR TODAS LAS TABLAS
-- ============================================
-- Ejecuta esto en Supabase SQL Editor para 
-- dejar la base de datos como nueva
-- ============================================

-- 1. Eliminar todas las compras
TRUNCATE TABLE purchases CASCADE;

-- 2. Eliminar todos los links
TRUNCATE TABLE links CASCADE;

-- ============================================
-- ✅ LISTO! Base de datos limpia
-- ============================================

-- VERIFICAR QUE TODO ESTÉ LIMPIO:
-- SELECT COUNT(*) FROM purchases;  -- Debe ser 0
-- SELECT COUNT(*) FROM links;      -- Debe ser 0
