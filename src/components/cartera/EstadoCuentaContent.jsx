import { useState } from 'react';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { PaginatedTable } from '../common/PaginatedTable';
import { usePaginatedResource } from '../../hooks/usePaginatedResource';
import { listarCobrosPorInmueble } from '../../services/cobroService';
import { formatearMoneda, formatearFecha } from '../../utils/formato';
import { ReportarPagoDialog } from './ReportarPagoDialog';
import { PagosDelCobroDialog } from './PagosDelCobroDialog';

const COLUMNAS = [
  { campo: 'fechaGeneracion', encabezado: 'Fecha de generacion', render: (fila) => formatearFecha(fila.fechaGeneracion) },
  { campo: 'fechaVencimiento', encabezado: 'Vence', render: (fila) => formatearFecha(fila.fechaVencimiento) },
  { campo: 'monto', encabezado: 'Saldo', render: (fila) => formatearMoneda(fila.monto) },
  {
    campo: 'estado',
    encabezado: 'Estado',
    render: (fila) => (
      <Chip label={fila.estado} size="small" color={fila.estado === 'PAGADO' ? 'success' : 'warning'} />
    ),
  },
];

export function EstadoCuentaContent({ inmuebleId, puedeReportarPago }) {
  const { filas, totalElementos, cargando, error, pagina, tamanoPagina, setPagina, setTamanoPagina, recargar } =
    usePaginatedResource((paginado) => listarCobrosPorInmueble(inmuebleId, paginado), [inmuebleId]);

  const [cobroParaReportar, setCobroParaReportar] = useState(null);
  const [cobroParaVerPagos, setCobroParaVerPagos] = useState(null);

  return (
    <>
      <PaginatedTable
        columnas={COLUMNAS}
        filas={filas}
        cargando={cargando}
        error={error}
        pagina={pagina}
        tamanoPagina={tamanoPagina}
        totalElementos={totalElementos}
        onCambiarPagina={setPagina}
        onCambiarTamano={setTamanoPagina}
        mensajeVacio="Aun no se han generado cuotas para este inmueble."
        renderAcciones={(fila) => (
          <>
            <Tooltip title="Ver pagos reportados">
              <IconButton size="small" onClick={() => setCobroParaVerPagos(fila.id)}>
                <ReceiptLongOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {puedeReportarPago && fila.estado === 'PENDIENTE' && (
              <Tooltip title="Reportar pago">
                <IconButton size="small" onClick={() => setCobroParaReportar(fila.id)}>
                  <PaymentsOutlinedIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      />

      {cobroParaReportar && (
        <ReportarPagoDialog
          abierto={Boolean(cobroParaReportar)}
          cobroId={cobroParaReportar}
          onCerrar={() => setCobroParaReportar(null)}
          onGuardado={() => {
            setCobroParaReportar(null);
            recargar();
          }}
        />
      )}

      {cobroParaVerPagos && (
        <PagosDelCobroDialog
          abierto={Boolean(cobroParaVerPagos)}
          cobroId={cobroParaVerPagos}
          onCerrar={() => setCobroParaVerPagos(null)}
        />
      )}
    </>
  );
}
