-- Función SQL para marcar links expirados como inactivos
-- Esta función puede ser ejecutada periódicamente usando pg_cron

CREATE OR REPLACE FUNCTION expire_old_links()
RETURNS TABLE(expired_count bigint) AS $$
BEGIN
  -- Actualizar links activos que ya expiraron
  UPDATE links
  SET active = false
  WHERE active = true
    AND expires_at < NOW();
  
  -- Retornar cantidad de links expirados
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN QUERY SELECT expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Opción 1: Usar pg_cron (requiere la extensión pg_cron en Supabase)
-- Para habilitar pg_cron, ir a Database > Extensions en Supabase dashboard
-- y habilitar la extensión "pg_cron"

-- Ejecutar la función cada 5 minutos
-- SELECT cron.schedule(
--   'expire-old-links',
--   '*/5 * * * *',
--   $$ SELECT expire_old_links(); $$
-- );

-- Para ver los cron jobs activos:
-- SELECT * FROM cron.job;

-- Para eliminar el cron job:
-- SELECT cron.unschedule('expire-old-links');
