import { useCallback, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { PageHeader } from '../../../components/common/PageHeader';
import { PaginatedTable } from '../../../components/common/PaginatedTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { listarPagosEnVerificacion, aprobarPago, rechazarPago, descargarSoportePago } from '../../../services/pagoService';
import { abrirBlobEnNuevaPestana } from '../../../utils/abrirArchivo';
import { formatearMoneda, formatearFecha } from '../../../utils/formato';

const COLUMNAS = [
  { campo: 'cobroId', encabezado: 'Id de cobro' },
  { campo: 'fechaPago', encabezado: 'Fecha de pago', render: (fila) => formatearFecha(fila.fechaPago) },
  { campo: 'montoPagado', encabezado: 'Monto', render: (fila) => formatearMoneda(fila.montoPagado) },
  { campo: 'metodoPago', encabezado: 'Metodo', render: (fila) => fila.metodoPago ?? '-' },
];

export function VerificacionPagosPage() {
  const { mostrarNotificacion } = useSnackbar();
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const cargarPagos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await listarPagosEnVerificacion();
      setPagos(datos);
    } catch (err) {
      setError(err.mensaje ?? 'No fue posible cargar los pagos pendientes.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPagos();
  }, [cargarPagos]);

  const verSoporte = async (pagoId) => {
    try {
      const blob = await descargarSoportePago(pagoId);
      abrirBlobEnNuevaPestana(blob);
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible abrir el soporte.', 'error');
    }
  };

  const confirmarAccion = async () => {
    setProcesando(true);
    try {
      if (confirmacion.accion === 'aprobar') {
        await aprobarPago(confirmacion.pago.id);
        mostrarNotificacion('Pago aprobado correctamente.');
      } else {
        await rechazarPago(confirmacion.pago.id);
        mostrarNotificacion('Pago rechazado.');
      }
      setConfirmacion(null);
      cargarPagos();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible procesar el pago.', 'error');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <>
      <PageHeader titulo="Validación de Pagos" subtitulo="Revisión de transacciones y abonos reportados por residentes" />

      <PaginatedTable
        columnas={COLUMNAS}
        filas={pagos}
        cargando={cargando}
        error={error}
        mensajeVacio="No existen pagos registrados pendientes de revisión."
        renderAcciones={(fila) => (
          <>
            <Tooltip title="Ver soporte">
              <IconButton size="small" onClick={() => verSoporte(fila.id)}>
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Aprobar">
              <IconButton size="small" onClick={() => setConfirmacion({ pago: fila, accion: 'aprobar' })}>
                <CheckCircleOutlineOutlinedIcon fontSize="small" color="success" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rechazar">
              <IconButton size="small" onClick={() => setConfirmacion({ pago: fila, accion: 'rechazar' })}>
                <CancelOutlinedIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </>
        )}
      />

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo={confirmacion?.accion === 'aprobar' ? 'Aprobar pago' : 'Rechazar pago'}
        mensaje={
          confirmacion?.accion === 'aprobar'
            ? `¿Confirmas que recibiste el pago por ${formatearMoneda(confirmacion?.pago?.monto)} del comprobante ${confirmacion?.pago?.numeroComprobante}? El saldo se reflejará en la cuenta de la unidad.`
            : `¿Confirmas que deseas rechazar el pago por ${formatearMoneda(confirmacion?.pago?.monto)}? El residente será notificado de que no fue validado.`
        }
        textoConfirmar={confirmacion?.accion === 'aprobar' ? 'Aprobar pago' : 'Rechazar pago'}
        colorConfirmar={confirmacion?.accion === 'aprobar' ? 'success' : 'error'}
        cargando={procesando}
        onConfirmar={confirmarAccion}
        onCancelar={() => setConfirmacion(null)}
      />
    </>
  );
}
