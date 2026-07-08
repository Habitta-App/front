import { useState } from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { PageHeader } from '../../../components/common/PageHeader';
import { PaginatedTable } from '../../../components/common/PaginatedTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { usePaginatedResource } from '../../../hooks/usePaginatedResource';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { listarUsuarios, desactivarUsuario, activarUsuario } from '../../../services/usuarioService';
import { UsuarioFormDialog } from './UsuarioFormDialog';

const COLUMNAS = [
  { campo: 'nombre', encabezado: 'Nombre' },
  { campo: 'email', encabezado: 'Correo electronico' },
  { campo: 'rol', encabezado: 'Rol', render: (fila) => <Chip label={fila.rol} size="small" /> },
  {
    campo: 'activo',
    encabezado: 'Estado',
    render: (fila) => (
      <Chip label={fila.activo ? 'Activo' : 'Inactivo'} size="small" color={fila.activo ? 'success' : 'default'} />
    ),
  },
];

export function UsuariosListPage() {
  const { mostrarNotificacion } = useSnackbar();
  const { filas, totalElementos, cargando, error, pagina, tamanoPagina, setPagina, setTamanoPagina, recargar } =
    usePaginatedResource(listarUsuarios);

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [modoDialogo, setModoDialogo] = useState('crear');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [procesandoConfirmacion, setProcesandoConfirmacion] = useState(false);

  const abrirCreacion = () => {
    setModoDialogo('crear');
    setUsuarioSeleccionado(null);
    setDialogoAbierto(true);
  };

  const abrirEdicion = (usuario) => {
    setModoDialogo('editar');
    setUsuarioSeleccionado(usuario);
    setDialogoAbierto(true);
  };

  const manejarGuardado = () => {
    setDialogoAbierto(false);
    recargar();
  };

  const solicitarCambioEstado = (usuario) => {
    setConfirmacion({
      usuario,
      accion: usuario.activo ? 'desactivar' : 'activar',
    });
  };

  const confirmarCambioEstado = async () => {
    setProcesandoConfirmacion(true);
    try {
      if (confirmacion.accion === 'desactivar') {
        await desactivarUsuario(confirmacion.usuario.id);
        mostrarNotificacion('Usuario desactivado.');
      } else {
        await activarUsuario(confirmacion.usuario.id);
        mostrarNotificacion('Usuario reactivado.');
      }
      setConfirmacion(null);
      recargar();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible actualizar el estado del usuario.', 'error');
    } finally {
      setProcesandoConfirmacion(false);
    }
  };

  return (
    <>
      <PageHeader
        titulo="Directorio de Usuarios"
        subtitulo="Administra residentes, miembros del consejo y personal de seguridad"
        accion={
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={abrirCreacion}>
            Registrar usuario
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
        mensajeVacio="Aún no hay usuarios registrados en el sistema."
        renderAcciones={(fila) => (
          <>
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

      <UsuarioFormDialog
        abierto={dialogoAbierto}
        modo={modoDialogo}
        usuarioInicial={usuarioSeleccionado}
        onCerrar={() => setDialogoAbierto(false)}
        onGuardado={manejarGuardado}
      />

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo={confirmacion?.accion === 'desactivar' ? 'Bloquear acceso de usuario' : 'Habilitar acceso de usuario'}
        mensaje={`¿Confirmas que deseas ${confirmacion?.accion === 'desactivar' ? 'bloquear el acceso' : 'habilitar el acceso'} a ${confirmacion?.usuario?.nombre}?`}
        textoConfirmar={confirmacion?.accion === 'desactivar' ? 'Bloquear' : 'Habilitar'}
        colorConfirmar={confirmacion?.accion === 'desactivar' ? 'error' : 'success'}
        cargando={procesandoConfirmacion}
        onConfirmar={confirmarCambioEstado}
        onCancelar={() => setConfirmacion(null)}
      />
    </>
  );
}
