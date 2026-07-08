import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { PageHeader } from '../../components/common/PageHeader';
import { PaginatedTable } from '../../components/common/PaginatedTable';
import { generarReporteCartera } from '../../services/reporteCarteraService';
import { formatearMoneda } from '../../utils/formato';

const COLUMNAS = [
  { campo: 'numeroIdentificador', encabezado: 'Inmueble' },
  { campo: 'saldoPendiente', encabezado: 'Saldo pendiente', render: (fila) => formatearMoneda(fila.saldoPendiente) },
];

function TarjetaIndicador({ titulo, valor, color }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="body2" color="text.secondary">
        {titulo}
      </Typography>
      <Typography variant="h4" fontWeight={700} color={color}>
        {valor}
      </Typography>
    </Paper>
  );
}

export function ReporteCarteraPage() {
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generarReporteCartera()
      .then(setReporte)
      .catch((err) => setError(err.mensaje ?? 'No fue posible cargar el reporte de cartera.'))
      .finally(() => setCargando(false));
  }, []);

  const filasConId = reporte?.inmueblesMorosos.map((item) => ({ ...item, id: item.inmuebleId })) ?? [];

  return (
    <>
      <PageHeader titulo="Reporte Financiero" subtitulo="Consulta el balance general de recaudos y cartera pendiente en tiempo real" />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TarjetaIndicador
            titulo="Recaudo total del periodo en curso"
            valor={cargando ? '...' : formatearMoneda(reporte?.totalRecaudadoMes)}
            color="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TarjetaIndicador
            titulo="Cartera total vencida"
            valor={cargando ? '...' : formatearMoneda(reporte?.totalEnMora)}
            color="error.main"
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Unidades con saldo en mora (organizado de mayor a menor deuda)
      </Typography>
      <PaginatedTable
        columnas={COLUMNAS}
        filas={filasConId}
        cargando={cargando}
        error={error}
        mensajeVacio="No existen unidades con saldos pendientes por abonar."
      />
    </>
  );
}
