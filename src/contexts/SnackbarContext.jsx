import { createContext, useCallback, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const SnackbarContext = createContext(null);

/**
 * Unico punto de notificaciones "toast" de toda la app (exito/error/info).
 * Evita que cada pagina declare su propio <Snackbar> (DRY).
 */
export function SnackbarProvider({ children }) {
  const [estado, setEstado] = useState({ abierto: false, mensaje: '', severidad: 'success' });

  const mostrarNotificacion = useCallback((mensaje, severidad = 'success') => {
    setEstado({ abierto: true, mensaje, severidad });
  }, []);

  const cerrarNotificacion = useCallback(() => {
    setEstado((anterior) => ({ ...anterior, abierto: false }));
  }, []);

  const valor = useMemo(() => ({ mostrarNotificacion }), [mostrarNotificacion]);

  return (
    <SnackbarContext.Provider value={valor}>
      {children}
      <Snackbar
        open={estado.abierto}
        autoHideDuration={5000}
        onClose={cerrarNotificacion}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={cerrarNotificacion} severity={estado.severidad} variant="filled" sx={{ width: '100%' }}>
          {estado.mensaje}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
