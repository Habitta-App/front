import { useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { PaginatedTable } from '../../../components/common/PaginatedTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { usePaginatedResource } from '../../../hooks/usePaginatedResource';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { listarInmuebles, desactivarInmueble, activarInmueble } from '../../../services/inmuebleService';
import { InmuebleFormDialog } from './InmuebleFormDialog';

const COLUMNAS = [
  { campo: 'numeroIdentificador', encabezado: 'Identificador' },
  { campo: 'tipo', encabezado: 'Tipo' },
  {
    campo: 'activo',
    encabezado: 'Estado',
    render: (fila) => (
      <Chip label={fila.activo ? 'Activo' : 'Inactivo'} size="small" color={fila.activo ? 'success' : 'default'} />
    ),
  },
];

export function InmueblesListPage() {
  const navigate = useNavigate();
  const { mostrarNotificacion } = useSnackbar();
  const { filas, totalElementos, cargando, error, pagina, tamanoPagina, setPagina, setTamanoPagina, recargar } =
    usePaginatedResource(listarInmuebles);

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoConfirmacion, setProcesandoConfirmacion] = useState(false);

  const abrirCreacion = () => {
    setInmuebleSeleccionado(null);
    setDialogoAbierto(true);
  };

  const abrirEdicion = (inmueble) => {
    setInmuebleSeleccionado(inmueble);
    setDialogoAbierto(true);
  };

  const manejarGuardado = () => {
    setDialogoAbierto(false);
    recargar();
  };

  const solicitarCambioEstado = (inmueble) => {
    setConfirmacion({ inmueble, accion: inmueble.activo ? 'desactivar' : 'activar' });
  };

  const confirmarCambioEstado = async () => {
    setProcesandoConfirmacion(true);
    try {
      if (confirmacion.accion === 'desactivar') {
        await desactivarInmueble(confirmacion.inmueble.id);
        mostrarNotificacion('Inmueble desactivado.');
      } else {
        await activarInmueble(confirmacion.inmueble.id);
        mostrarNotificacion('Inmueble reactivado.');
      }
      setConfirmacion(null);
      recargar();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible actualizar el estado del inmueble.', 'error');
    } finally {
      setProcesandoConfirmacion(false);
    }
  };

  return (
    <>
      <PageHeader
        titulo="Unidades del Conjunto"
        subtitulo="Administra las unidades residenciales e identifica a sus propietarios y residentes"
        accion={
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={abrirCreacion}>
            Registrar unidad
          </Button>
        }
      />

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
        mensajeVacio="Aún no hay unidades registradas en el sistema."
        renderAcciones={(fila) => (
          <>
            <Tooltip title="Ver residentes y propietarios">
              <IconButton size="small" onClick={() => navigate(`/admin/inmuebles/${fila.id}/vinculos`)}>
                <GroupOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Estado de cuenta">
              <IconButton size="small" onClick={() => navigate(`/admin/inmuebles/${fila.id}/cobros`)}>
                <ReceiptLongOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => abrirEdicion(fila)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={fila.activo ? 'Desactivar' : 'Activar'}>
              <IconButton size="small" onClick={() => solicitarCambioEstado(fila)}>
                {fila.activo ? (
                  <BlockOutlinedIcon fontSize="small" color="error" />
                ) : (
                  <CheckCircleOutlineOutlinedIcon fontSize="small" color="success" />
                )}
              </IconButton>
            </Tooltip>
          </>
        )}
      />

      <InmuebleFormDialog
        abierto={dialogoAbierto}
        inmuebleInicial={inmuebleSeleccionado}
        onCerrar={() => setDialogoAbierto(false)}
        onGuardado={manejarGuardado}
      />

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo={confirmacion?.accion === 'desactivar' ? 'Desactivar unidad' : 'Activar unidad'}
        mensaje={`¿Confirmas que deseas ${confirmacion?.accion} la unidad ${confirmacion?.inmueble?.numeroIdentificador}?`}
        textoConfirmar={confirmacion?.accion === 'desactivar' ? 'Desactivar' : 'Activar'}
        colorConfirmar={confirmacion?.accion === 'desactivar' ? 'error' : 'success'}
        cargando={procesandoConfirmacion}
        onConfirmar={confirmarCambioEstado}
        onCancelar={() => setConfirmacion(null)}
      />
    </>
  );
}
