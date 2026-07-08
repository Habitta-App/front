import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TablePagination from '@mui/material/TablePagination';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingState } from '../../components/feedback/LoadingState';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ErrorState } from '../../components/feedback/ErrorState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { usePaginatedResource } from '../../hooks/usePaginatedResource';
import { useSnackbar } from '../../hooks/useSnackbar';
import { useAuth } from '../../hooks/useAuth';
import { listarAnuncios, eliminarAnuncio } from '../../services/anuncioService';
import { formatearFechaHora } from '../../utils/formato';
import { AnuncioFormDialog } from './AnuncioFormDialog';

export function AnunciosPage() {
  const { usuario } = useAuth();
  const { mostrarNotificacion } = useSnackbar();
  const esAdmin = usuario.rol === 'ADMIN';

  const { filas, totalElementos, cargando, error, pagina, tamanoPagina, setPagina, setTamanoPagina, recargar } =
    usePaginatedResource(listarAnuncios);

  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [anuncioSeleccionado, setAnuncioSeleccionado] = useState(null);
  const [anuncioAEliminar, setAnuncioAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const abrirCreacion = () => {
    setAnuncioSeleccionado(null);
    setDialogoAbierto(true);
  };

  const abrirEdicion = (anuncio) => {
    setAnuncioSeleccionado(anuncio);
    setDialogoAbierto(true);
  };

  const manejarGuardado = () => {
    setDialogoAbierto(false);
    recargar();
  };

  const confirmarEliminacion = async () => {
    setEliminando(true);
    try {
      await eliminarAnuncio(anuncioAEliminar.id);
      mostrarNotificacion('Anuncio eliminado.');
      setAnuncioAEliminar(null);
      recargar();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible eliminar el anuncio.', 'error');
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      <PageHeader
        titulo="Circulares y Avisos"
        subtitulo="Comunicaciones y novedades relevantes para la comunidad"
        accion={
          esAdmin && (
            <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={abrirCreacion}>
              Publicar comunicado
            </Button>
          )
        }
      />

      {cargando ? (
        <LoadingState />
      ) : error ? (
        <ErrorState mensaje={error} />
      ) : filas.length === 0 ? (
        <EmptyState mensaje="No hay circulares publicadas por el momento." />
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filas.map((anuncio) => (
              <Card key={anuncio.id} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {anuncio.titulo}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Publicado por {anuncio.autorNombre} · {formatearFechaHora(anuncio.fechaPublicacion)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1.5, whiteSpace: 'pre-wrap' }}>
                    {anuncio.contenido}
                  </Typography>
                </CardContent>
                {esAdmin && (
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => abrirEdicion(anuncio)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" onClick={() => setAnuncioAEliminar(anuncio)}>
                        <DeleteOutlinedIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                )}
              </Card>
            ))}
          </Box>

          <TablePagination
            component="div"
            count={totalElementos}
            page={pagina}
            onPageChange={(_evento, nuevaPagina) => setPagina(nuevaPagina)}
            rowsPerPage={tamanoPagina}
            onRowsPerPageChange={(evento) => setTamanoPagina(Number(evento.target.value))}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Avisos por página"
          />
        </>
      )}

      {esAdmin && (
        <>
          <AnuncioFormDialog
            abierto={dialogoAbierto}
            anuncioInicial={anuncioSeleccionado}
            onCerrar={() => setDialogoAbierto(false)}
            onGuardado={manejarGuardado}
          />

          <ConfirmDialog
            abierto={Boolean(anuncioAEliminar)}
            titulo="Dar de baja comunicado"
            mensaje={`¿Confirmas que deseas retirar el comunicado "${anuncioAEliminar?.titulo}" del tablero público?`}
            textoConfirmar="Retirar"
            colorConfirmar="error"
            cargando={eliminando}
            onConfirmar={confirmarEliminacion}
            onCancelar={() => setAnuncioAEliminar(null)}
          />
        </>
      )}
    </>
  );
}
