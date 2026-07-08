import { useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { PageHeader } from '../../components/common/PageHeader';
import { PaginatedTable } from '../../components/common/PaginatedTable';
import { LoadingState } from '../../components/feedback/LoadingState';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { SelectorMisInmuebles } from '../../components/common/SelectorMisInmuebles';
import { useMisInmuebles } from '../../hooks/useMisInmuebles';
import { usePaginatedResource } from '../../hooks/usePaginatedResource';
import { listarVisitasPorInmueble } from '../../services/visitaService';
import { formatearFecha, formatearFechaHora } from '../../utils/formato';
import { AutorizarVisitaDialog } from './AutorizarVisitaDialog';

const COLORES_ESTADO = {
  PROGRAMADA: 'info',
  EN_CURSO: 'warning',
  FINALIZADA: 'default',
};

const COLUMNAS = [
  { campo: 'nombreVisitante', encabezado: 'Visitante' },
  { campo: 'fechaEsperada', encabezado: 'Fecha esperada', render: (fila) => formatearFecha(fila.fechaEsperada) },
  { campo: 'requiereAnuncio', encabezado: 'Anunciar', render: (fila) => (fila.requiereAnuncio ? 'Si' : 'No') },
  { campo: 'fechaIngreso', encabezado: 'Ingreso', render: (fila) => formatearFechaHora(fila.fechaIngreso) },
  { campo: 'fechaSalida', encabezado: 'Salida', render: (fila) => formatearFechaHora(fila.fechaSalida) },
  {
    campo: 'estado',
    encabezado: 'Estado',
    render: (fila) => <Chip label={fila.estado} size="small" color={COLORES_ESTADO[fila.estado] ?? 'default'} />,
  },
];

function ListadoVisitas({ inmuebleId }) {
  const { filas, totalElementos, cargando, error, pagina, tamanoPagina, setPagina, setTamanoPagina, recargar } =
    usePaginatedResource((paginado) => listarVisitasPorInmueble(inmuebleId, paginado), [inmuebleId]);

  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  return (
    <>
      <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setDialogoAbierto(true)} sx={{ mb: 2 }}>
        Autorizar visitante
      </Button>

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
        mensajeVacio="Aun no has autorizado ningun visitante."
      />

      <AutorizarVisitaDialog
        abierto={dialogoAbierto}
        inmuebleId={inmuebleId}
        onCerrar={() => setDialogoAbierto(false)}
        onGuardado={() => {
          setDialogoAbierto(false);
          recargar();
        }}
      />
    </>
  );
}

export function VisitasPage() {
  const { inmuebles, inmuebleSeleccionado, setInmuebleSeleccionado, error } = useMisInmuebles();

  if (error) {
    return <ErrorState mensaje={error} />;
  }

  if (inmuebles === null) {
    return <LoadingState mensaje="Cargando tu informacion..." />;
  }

  if (inmuebles.length === 0) {
    return <EmptyState mensaje="No tienes ningun inmueble vinculado. Contacta a la administracion." />;
  }

  return (
    <>
      <PageHeader titulo="Mis Visitas" subtitulo="Autoriza visitantes y consulta el historial de ingresos" />
      <SelectorMisInmuebles inmuebles={inmuebles} valor={inmuebleSeleccionado} onCambiar={setInmuebleSeleccionado} />
      {inmuebleSeleccionado && <ListadoVisitas inmuebleId={inmuebleSeleccionado} />}
    </>
  );
}
