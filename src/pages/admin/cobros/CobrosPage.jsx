import { useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import { PageHeader } from '../../../components/common/PageHeader';
import { PaginatedTable } from '../../../components/common/PaginatedTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { generarCobrosMasivos } from '../../../services/cobroService';
import { formatearMoneda, formatearFecha } from '../../../utils/formato';

const COLUMNAS = [
  { campo: 'inmuebleId', encabezado: 'Id de inmueble' },
  { campo: 'fechaGeneracion', encabezado: 'Fecha de generacion', render: (fila) => formatearFecha(fila.fechaGeneracion) },
  { campo: 'fechaVencimiento', encabezado: 'Vence', render: (fila) => formatearFecha(fila.fechaVencimiento) },
  { campo: 'monto', encabezado: 'Monto (incluye mora)', render: (fila) => formatearMoneda(fila.monto) },
  { campo: 'estado', encabezado: 'Estado', render: (fila) => <Chip label={fila.estado} size="small" /> },
];

export function CobrosPage() {
  const { mostrarNotificacion } = useSnackbar();
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [cobrosGenerados, setCobrosGenerados] = useState(null);

  const confirmarGeneracion = async () => {
    setGenerando(true);
    try {
      const resultado = await generarCobrosMasivos();
      setCobrosGenerados(resultado);
      mostrarNotificacion(`Se generaron ${resultado.length} cobro(s) correctamente.`);
      setConfirmacionAbierta(false);
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible generar los cobros.', 'error');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <>
      <PageHeader
        titulo="Gestión de Cartera"
        subtitulo="Facturación general de cuotas de administración mensual"
        accion={
          <Button
            variant="contained"
            startIcon={generando ? <CircularProgress size={18} color="inherit" /> : <PlayArrowOutlinedIcon />}
            onClick={() => setConfirmacionAbierta(true)}
            disabled={generando}
          >
            Facturar periodo actual
          </Button>
        }
      />

      {cobrosGenerados ? (
        <PaginatedTable
          columnas={COLUMNAS}
          filas={cobrosGenerados}
          cargando={false}
          mensajeVacio="No se generaron facturas en esta ocasión."
        />
      ) : (
        <PaginatedTable columnas={COLUMNAS} filas={[]} cargando={false} mensajeVacio="Aún no se ha realizado la facturación masiva del mes actual." />
      )}

      <ConfirmDialog
        abierto={confirmacionAbierta}
        titulo="Facturación masiva de administración"
        mensaje="Esta acción correrá el proceso de facturación del mes actual para todas las unidades activas. Todo saldo pendiente o cartera vencida se sumará automáticamente. ¿Deseas ejecutar el proceso?"
        textoConfirmar="Facturar ahora"
        cargando={generando}
        onConfirmar={confirmarGeneracion}
        onCancelar={() => setConfirmacionAbierta(false)}
      />
    </>
  );
}
