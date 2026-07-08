import { useCallback, useEffect, useState } from 'react';

/**
 * Encapsula el estado de paginacion + carga + error de un listado contra la
 * API (usa el PageResponse<T> del backend: content, totalElements...). Se
 * reutiliza en Usuarios, Inmuebles, Cobros, etc. (DRY).
 *
 * `dependenciasReactivas` permite forzar recarga cuando cambia algo externo
 * al propio hook (ej. el id de inmueble en una lista anidada).
 */
export function usePaginatedResource(fetcher, dependenciasReactivas = []) {
  const [pagina, setPagina] = useState(0);
  const [tamanoPagina, setTamanoPagina] = useState(10);
  const [datos, setDatos] = useState({ content: [], totalElements: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetcher({ page: pagina, size: tamanoPagina });
      setDatos(respuesta);
    } catch (err) {
      setError(err.mensaje ?? 'No fue posible cargar la informacion.');
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, tamanoPagina, ...dependenciasReactivas]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    filas: datos.content,
    totalElementos: datos.totalElements,
    cargando,
    error,
    pagina,
    tamanoPagina,
    setPagina,
    setTamanoPagina,
    recargar: cargar,
  };
}
