import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { PageHeader } from '../../components/common/PageHeader';
import { PaginatedTable } from '../../components/common/PaginatedTable';
import { useSnackbar } from '../../hooks/useSnackbar';
import { usePaginatedResource } from '../../hooks/usePaginatedResource';
import { listarTodasVisitas, marcarIngresoVisita, marcarSalidaVisita } from '../../services/visitaService';
import { formatearFecha, formatearFechaHora } from '../../utils/formato';
import { RegistrarVisitaGuardaDialog } from './RegistrarVisitaGuardaDialog';

const COLORES_ESTADO = {
  PROGRAMADA: 'info',
  EN_CURSO: 'warning',
  FINALIZADA: 'default',
};

const COLUMNAS = [
  { campo: 'nombreVisitante', encabezado: 'Visitante' },
  { campo: 'inmuebleId', encabezado: 'Id de inmueble' },
  { campo: 'fechaEsperada', encabezado: 'Fecha esperada', render: (fila) => formatearFecha(fila.fechaEsperada) },
  { campo: 'requiereAnuncio', encabezado: 'Anunciar', render: (fila) => (fila.requiereAnuncio ? 'Si' : 'No') },
  { campo: 'fechaIngreso', encabezado: 'Ingreso', render: (fila) => formatearFechaHora(fila.fechaIngreso) },
  {
    campo: 'estado',
    encabezado: 'Estado',
    render: (fila) => <Chip label={fila.estado} size="small" color={COLORES_ESTADO[fila.estado] ?? 'default'} />,
  },
];

export function ControlAccesoPage() {
  const { mostrarNotificacion } = useSnackbar();
  const [dialogoRegistroAbierto, setDialogoRegistroAbierto] = useState(false);

  // Estados de filtros temporales
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroInmuebleId, setFiltroInmuebleId] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  // Estados de filtros aplicados a la búsqueda
  const [filtrosAplicados, setFiltrosAplicados] = useState({ nombre: '', inmuebleId: '', fecha: '' });

  const fetcherVisitas = useCallback(
    ({ page, size }) =>
      listarTodasVisitas({
        page,
        size,
        nombre: filtrosAplicados.nombre,
        inmuebleId: filtrosAplicados.inmuebleId,
        fechaIngreso: filtrosAplicados.fecha,
      }),
    [filtrosAplicados]
  );

  const { filas, totalElementos, cargando, error, pagina, tamanoPagina, setPagina, setTamanoPagina, recargar } =
    usePaginatedResource(fetcherVisitas, [filtrosAplicados]);

  const aplicarFiltros = (evento) => {
    evento.preventDefault();
    setPagina(0); // Reiniciar a la primera página al buscar
    setFiltrosAplicados({
      nombre: filtroNombre.trim(),
      inmuebleId: filtroInmuebleId.trim(),
      fecha: filtroFecha,
    });
  };

  const limpiarFiltros = () => {
    setFiltroNombre('');
    setFiltroInmuebleId('');
    setFiltroFecha('');
    setPagina(0);
    setFiltrosAplicados({ nombre: '', inmuebleId: '', fecha: '' });
  };

  const manejarIngreso = async (visitaId) => {
    try {
      await marcarIngresoVisita(visitaId);
      mostrarNotificacion('Ingreso registrado.');
      recargar();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible registrar el ingreso.', 'error');
    }
  };

  const manejarSalida = async (visitaId) => {
    try {
      await marcarSalidaVisita(visitaId);
      mostrarNotificacion('Salida registrada.');
      recargar();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible registrar la salida.', 'error');
    }
  };

  return (
    <>
      <PageHeader
        titulo="Portería y Accesos"
        subtitulo="Gestiona la agenda, autoriza ingresos y salidas en tiempo real"
        accion={
          <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setDialogoRegistroAbierto(true)}>
            Visita sin cita
          </Button>
        }
      />

      <Box component="form" onSubmit={aplicarFiltros} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
          label="Nombre del visitante"
          value={filtroNombre}
          onChange={(evento) => setFiltroNombre(evento.target.value)}
          size="small"
        />
        <TextField
          label="Id del inmueble (Ej: 101)"
          value={filtroInmuebleId}
          onChange={(evento) => setFiltroInmuebleId(evento.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        />
        <TextField
          label="Fecha de ingreso"
          type="date"
          value={filtroFecha}
          onChange={(evento) => setFiltroFecha(evento.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
        <Button type="submit" variant="contained" startIcon={<SearchOutlinedIcon />}>
          Buscar
        </Button>
        <Button variant="outlined" onClick={limpiarFiltros} color="inherit">
          Limpiar
        </Button>
      </Box>

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
        mensajeVacio="No se encontraron visitas que coincidan con los filtros aplicados."
        renderAcciones={(fila) => (
          <>
            {fila.estado === 'PROGRAMADA' && (
              <Tooltip title="Marcar ingreso">
                <IconButton size="small" onClick={() => manejarIngreso(fila.id)}>
                  <LoginOutlinedIcon fontSize="small" color="success" />
                </IconButton>
              </Tooltip>
            )}
            {fila.estado === 'EN_CURSO' && (
              <Tooltip title="Marcar salida">
                <IconButton size="small" onClick={() => manejarSalida(fila.id)}>
                  <LogoutOutlinedIcon fontSize="small" color="warning" />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      />

      <RegistrarVisitaGuardaDialog
        abierto={dialogoRegistroAbierto}
        onCerrar={() => setDialogoRegistroAbierto(false)}
        onGuardado={() => {
          setDialogoRegistroAbierto(false);
          recargar();
        }}
      />
    </>
  );
}
