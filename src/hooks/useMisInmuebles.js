import { useEffect, useState } from 'react';
import { listarMisInmuebles } from '../services/inmuebleService';

/**
 * Reutilizado por todas las paginas del Residente que necesitan saber
 * "sobre cual de mis inmuebles estoy trabajando" (estado de cuenta,
 * visitas, paquetes) - evita repetir la misma carga + seleccion (DRY).
 */
export function useMisInmuebles() {
  const [inmuebles, setInmuebles] = useState(null);
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listarMisInmuebles()
      .then((datos) => {
        setInmuebles(datos);
        if (datos.length > 0) {
          setInmuebleSeleccionado(datos[0].id);
        } else {
          setError('Aún no tienes unidades vinculadas a tu cuenta. Por favor, comunícate con la administración para que te realicen la asignación.');
        }
      })
      .catch((err) => setError(err.mensaje ?? 'No fue posible cargar tus inmuebles.'));
  }, []);

  return { inmuebles, inmuebleSeleccionado, setInmuebleSeleccionado, error };
}
