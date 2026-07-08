import Chip from '@mui/material/Chip';
import { PageHeader } from '../../components/common/PageHeader';
import { PaginatedTable } from '../../components/common/PaginatedTable';
import { LoadingState } from '../../components/feedback/LoadingState';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { SelectorMisInmuebles } from '../../components/common/SelectorMisInmuebles';
import { useMisInmuebles } from '../../hooks/useMisInmuebles';
import { usePaginatedResource } from '../../hooks/usePaginatedResource';
import { listarPaquetesPorInmueble } from '../../services/paqueteService';
import { formatearFechaHora } from '../../utils/formato';

const COLUMNAS = [
  { campo: 'descripcion', encabezado: 'Descripcion' },
  { campo: 'fechaRecepcion', encabezado: 'Recibido', render: (fila) => formatearFechaHora(fila.fechaRecepcion) },
  { campo: 'fechaEntrega', encabezado: 'Entregado', render: (fila) => formatearFechaHora(fila.fechaEntrega) },
  {
    campo: 'estado',
    encabezado: 'Estado',
    render: (fila) => (
      <Chip label={fila.estado} size="small" color={fila.estado === 'ENTREGADO' ? 'success' : 'warning'} />
    ),
  },
];

function ListadoPaquetes({ inmuebleId }) {
  const { filas, totalElementos, cargando, error, pagina, tamanoPagina, setPagina, setTamanoPagina } =
    usePaginatedResource((paginado) => listarPaquetesPorInmueble(inmuebleId, paginado), [inmuebleId]);

  return (
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
      mensajeVacio="No hay paquetes registrados para este inmueble."
    />
  );
}

export function PaquetesResidentePage() {
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
      <PageHeader titulo="Mis Paquetes" subtitulo="Trazabilidad de la correspondencia recibida en porteria" />
      <SelectorMisInmuebles inmuebles={inmuebles} valor={inmuebleSeleccionado} onCambiar={setInmuebleSeleccionado} />
      {inmuebleSeleccionado && <ListadoPaquetes inmuebleId={inmuebleSeleccionado} />}
    </>
  );
}
