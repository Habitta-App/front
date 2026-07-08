import { useContext } from 'react';
import { SnackbarContext } from '../contexts/SnackbarContext';

export function useSnackbar() {
  const contexto = useContext(SnackbarContext);
  if (!contexto) {
    throw new Error('useSnackbar debe usarse dentro de un SnackbarProvider');
  }
  return contexto;
}
