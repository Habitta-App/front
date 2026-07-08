import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { PageHeader } from '../../components/common/PageHeader';
import { PaginatedTable } from '../../components/common/PaginatedTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/feedback/EmptyState';
import { usePaginatedResource } from '../../hooks/usePaginatedResource';
import { useSnackbar } from '../../hooks/useSnackbar';
import { listarInmuebles } from '../../services/inmuebleService';
import { listarPaquetesPorInmueble, entregarPaquete } from '../../services/paqueteService';
import { formatearFechaHora } from '../../utils/formato';
import { RegistrarPaqueteDialog } from './RegistrarPaqueteDialog';

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

export function PaquetesGuardaPage() {
  const { mostrarNotificacion } = useSnackbar();
  const [inmuebles, setInmuebles] = useState([]);
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [paqueteAEntregar, setPaqueteAEntregar] = useState(null);
  const [entregando, setEntregando] = useState(false);

  useEffect(() => {
    listarInmuebles({ page: 0, size: 200 })
      .then((respuesta) => setInmuebles(respuesta.content.filter((inmueble) => inmueble.activo)))
      .catch(() => setInmuebles([]));
  }, []);

  const { filas, totalElementos, cargando, error, pagina, tamanoPagina, setPagina, setTamanoPagina, recargar } =
    usePaginatedResource(
      (paginado) =>
        inmuebleSeleccionado
          ? listarPaquetesPorInmueble(inmuebleSeleccionado.id, paginado)
          : Promise.resolve({ content: [], totalElements: 0 }),
      [inmuebleSeleccionado?.id],
    );

  const confirmarEntrega = async () => {
    setEntregando(true);
    try {
      await entregarPaquete(paqueteAEntregar.id);
      mostrarNotificacion('Paquete entregado correctamente.');
      setPaqueteAEntregar(null);
      recargar();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible entregar el paquete.', 'error');
    } finally {
      setEntregando(false);
    }
  };

  return (
    <>
      <PageHeader titulo="Correspondencia" subtitulo="Busca un inmueble para registrar o entregar paquetes" />

      <Autocomplete
        options={inmuebles}
        getOptionLabel={(inmueble) => inmueble.numeroIdentificador}
        value={inmuebleSeleccionado}
        onChange={(_evento, nuevoValor) => setInmuebleSeleccionado(nuevoValor)}
        isOptionEqualToValue={(opcion, valor) => opcion.id === valor.id}
        renderInput={(parametros) => <TextField {...parametros} label="Buscar inmueble" size="small" />}
        sx={{ maxWidth: 360, mb: 3 }}
      />

      {!inmuebleSeleccionado ? (
        <EmptyState mensaje="Selecciona un inmueble para ver o registrar sus paquetes." />
      ) : (
        <>
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setDialogoAbierto(true)} sx={{ mb: 2 }}>
            Registrar paquete
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
            mensajeVacio="No hay paquetes registrados para este inmueble."
            renderAcciones={(fila) =>
              fila.estado === 'EN_PORTERIA' && (
                <Tooltip title="Marcar como entregado">
                  <IconButton size="small" onClick={() => setPaqueteAEntregar(fila)}>
                    <CheckCircleOutlineOutlinedIcon fontSize="small" color="success" />
                  </IconButton>
                </Tooltip>
              )
            }
          />

          <RegistrarPaqueteDialog
            abierto={dialogoAbierto}
            inmuebleId={inmuebleSeleccionado.id}
            onCerrar={() => setDialogoAbierto(false)}
            onGuardado={() => {
              setDialogoAbierto(false);
              recargar();
            }}
          />

          <ConfirmDialog
            abierto={Boolean(paqueteAEntregar)}
            titulo="Entregar paquete"
            mensaje={`¿Confirmas la entrega de "${paqueteAEntregar?.descripcion}"?`}
            textoConfirmar="Entregar"
            colorConfirmar="success"
            cargando={entregando}
            onConfirmar={confirmarEntrega}
            onCancelar={() => setPaqueteAEntregar(null)}
          />
        </>
      )}
    </>
  );
}
