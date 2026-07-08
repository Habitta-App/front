import { PageHeader } from '../../components/common/PageHeader';
import { LoadingState } from '../../components/feedback/LoadingState';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { SelectorMisInmuebles } from '../../components/common/SelectorMisInmuebles';
import { EstadoCuentaContent } from '../../components/cartera/EstadoCuentaContent';
import { useMisInmuebles } from '../../hooks/useMisInmuebles';

export function MiCuentaPage() {
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
      <PageHeader titulo="Mi Estado de Cuenta" subtitulo="Cuotas generadas, pagos reportados y saldo actual" />
      <SelectorMisInmuebles inmuebles={inmuebles} valor={inmuebleSeleccionado} onCambiar={setInmuebleSeleccionado} />
      {inmuebleSeleccionado && <EstadoCuentaContent inmuebleId={inmuebleSeleccionado} puedeReportarPago />}
    </>
  );
}
