import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LinkOffOutlinedIcon from '@mui/icons-material/LinkOffOutlined';
import { PageHeader } from '../../../components/common/PageHeader';
import { PaginatedTable } from '../../../components/common/PaginatedTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { obtenerInmueblePorId } from '../../../services/inmuebleService';
import { listarVinculosActivos, desvincularUsuario } from '../../../services/vinculacionService';
import { VincularUsuarioDialog } from './VincularUsuarioDialog';

const COLUMNAS = [
  { campo: 'usuarioId', encabezado: 'Id de usuario' },
  {
    campo: 'esPropietario',
    encabezado: 'Rol en el inmueble',
    render: (fila) => (
      <Chip
        label={fila.esPropietario ? 'Propietario' : 'Residente actual'}
        size="small"
        color={fila.esPropietario ? 'primary' : 'default'}
      />
    ),
  },
];

export function VinculosPage() {
  const { inmuebleId } = useParams();
  const navigate = useNavigate();
  const { mostrarNotificacion } = useSnackbar();

  const [inmueble, setInmueble] = useState(null);
  const [vinculos, setVinculos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [vinculoADesvincular, setVinculoADesvincular] = useState(null);
  const [desvinculando, setDesvinculando] = useState(false);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [datosInmueble, datosVinculos] = await Promise.all([
        obtenerInmueblePorId(inmuebleId),
        listarVinculosActivos(inmuebleId),
      ]);
      setInmueble(datosInmueble);
      setVinculos(datosVinculos);
    } catch (err) {
      setError(err.mensaje ?? 'No fue posible cargar los vinculos del inmueble.');
    } finally {
      setCargando(false);
    }
  }, [inmuebleId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const manejarGuardado = () => {
    setDialogoAbierto(false);
    cargarDatos();
  };

  const confirmarDesvinculacion = async () => {
    setDesvinculando(true);
    try {
      await desvincularUsuario(inmuebleId, vinculoADesvincular.id);
      mostrarNotificacion('Usuario desvinculado correctamente.');
      setVinculoADesvincular(null);
      cargarDatos();
    } catch (err) {
      mostrarNotificacion(err.mensaje ?? 'No fue posible desvincular al usuario.', 'error');
    } finally {
      setDesvinculando(false);
    }
  };

  return (
    <>
      <PageHeader
        titulo={inmueble ? `Vinculos de ${inmueble.numeroIdentificador}` : 'Vinculos del inmueble'}
        subtitulo="Propietarios y residentes actuales asociados a este inmueble"
        accion={
          <>
            <Button startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate('/admin/inmuebles')} sx={{ mr: 1 }}>
              Volver
            </Button>
            <Button variant="contained" startIcon={<PersonAddOutlinedIcon />} onClick={() => setDialogoAbierto(true)}>
              Vincular usuario
            </Button>
          </>
        }
      />

      <PaginatedTable
        columnas={COLUMNAS}
        filas={vinculos}
        cargando={cargando}
        error={error}
        mensajeVacio="Este inmueble aun no tiene propietario ni residente vinculado."
        renderAcciones={(fila) => (
          <Tooltip title="Desvincular">
            <IconButton size="small" onClick={() => setVinculoADesvincular(fila)}>
              <LinkOffOutlinedIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        )}
      />

      <VincularUsuarioDialog
        abierto={dialogoAbierto}
        inmuebleId={inmuebleId}
        onCerrar={() => setDialogoAbierto(false)}
        onGuardado={manejarGuardado}
      />

      <ConfirmDialog
        abierto={Boolean(vinculoADesvincular)}
        titulo="Desvincular usuario"
        mensaje="¿Confirmas que deseas liberar este inmueble? El usuario dejara de estar vinculado, pero el historico se conserva."
        textoConfirmar="Desvincular"
        colorConfirmar="error"
        cargando={desvinculando}
        onConfirmar={confirmarDesvinculacion}
        onCancelar={() => setVinculoADesvincular(null)}
      />
    </>
  );
}
