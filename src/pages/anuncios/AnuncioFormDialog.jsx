import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { FormTextField } from '../../components/forms/FormTextField';
import { useSnackbar } from '../../hooks/useSnackbar';
import { crearAnuncio, actualizarAnuncio } from '../../services/anuncioService';

const esquema = z.object({
  titulo: z.string().min(1, 'El titulo es obligatorio').max(200, 'Maximo 200 caracteres'),
  contenido: z.string().min(1, 'El contenido es obligatorio'),
});

export function AnuncioFormDialog({ abierto, anuncioInicial, onCerrar, onGuardado }) {
  const { mostrarNotificacion } = useSnackbar();
  const esCreacion = !anuncioInicial;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { titulo: '', contenido: '' },
  });

  useEffect(() => {
    if (abierto) {
      reset({ titulo: anuncioInicial?.titulo ?? '', contenido: anuncioInicial?.contenido ?? '' });
    }
  }, [abierto, anuncioInicial, reset]);

  const onSubmit = async (valores) => {
    try {
      if (esCreacion) {
        await crearAnuncio(valores);
        mostrarNotificacion('Anuncio publicado correctamente.');
      } else {
        await actualizarAnuncio(anuncioInicial.id, valores);
        mostrarNotificacion('Anuncio actualizado correctamente.');
      }
      onGuardado();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible guardar el anuncio.', 'error');
    }
  };

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="sm">
      <DialogTitle>{esCreacion ? 'Publicar anuncio' : 'Editar anuncio'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <FormTextField name="titulo" control={control} label="Titulo" autoFocus />
          <FormTextField name="contenido" control={control} label="Contenido" multiline rows={5} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCerrar} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Guardar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
