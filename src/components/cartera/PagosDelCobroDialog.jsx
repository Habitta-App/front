import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { PaginatedTable } from '../common/PaginatedTable';
import { useSnackbar } from '../../hooks/useSnackbar';
import { listarPagosPorCobro, descargarSoportePago } from '../../services/pagoService';
import { abrirBlobEnNuevaPestana } from '../../utils/abrirArchivo';
import { formatearMoneda, formatearFecha } from '../../utils/formato';

const COLORES_ESTADO = {
  EN_VERIFICACION: 'warning',
  APROBADO: 'success',
  RECHAZADO: 'error',
};

const COLUMNAS = [
  { campo: 'fechaPago', encabezado: 'Fecha de pago', render: (fila) => formatearFecha(fila.fechaPago) },
  { campo: 'montoPagado', encabezado: 'Monto', render: (fila) => formatearMoneda(fila.montoPagado) },
  { campo: 'metodoPago', encabezado: 'Metodo', render: (fila) => fila.metodoPago ?? '-' },
  {
    campo: 'estado',
    encabezado: 'Estado',
    render: (fila) => <Chip label={fila.estado} size="small" color={COLORES_ESTADO[fila.estado] ?? 'default'} />,
  },
];

export function PagosDelCobroDialog({ abierto, cobroId, onCerrar }) {
  const { mostrarNotificacion } = useSnackbar();
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!abierto) {
      return;
    }
    setCargando(true);
    setError(null);
    listarPagosPorCobro(cobroId)
      .then(setPagos)
      .catch((err) => setError(err.mensaje ?? 'No fue posible cargar los pagos.'))
      .finally(() => setCargando(false));
  }, [abierto, cobroId]);

  const verSoporte = async (pagoId) => {
    try {
      const blob = await descargarSoportePago(pagoId);
      abrirBlobEnNuevaPestana(blob);
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible abrir el soporte.', 'error');
    }
  };

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="sm">
      <DialogTitle>Pagos reportados</DialogTitle>
      <DialogContent>
        <PaginatedTable
          columnas={COLUMNAS}
          filas={pagos}
          cargando={cargando}
          error={error}
          mensajeVacio="Aun no se ha reportado ningun pago para este cobro."
          renderAcciones={(fila) => (
            <Tooltip title="Ver soporte">
              <IconButton size="small" onClick={() => verSoporte(fila.id)}>
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCerrar}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
