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
import { FormTextField } from '../../../components/forms/FormTextField';
import { FormSelectField } from '../../../components/forms/FormSelectField';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { crearInmueble, actualizarInmueble } from '../../../services/inmuebleService';

const OPCIONES_TIPO = [
  { value: 'CASA', label: 'Casa' },
  { value: 'APARTAMENTO', label: 'Apartamento' },
];

const esquema = z.object({
  numeroIdentificador: z.string().min(1, 'El identificador es obligatorio').max(30),
  tipo: z.enum(['CASA', 'APARTAMENTO'], { message: 'Selecciona un tipo' }),
});

export function InmuebleFormDialog({ abierto, inmuebleInicial, onCerrar, onGuardado }) {
  const { mostrarNotificacion } = useSnackbar();
  const esCreacion = !inmuebleInicial;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { numeroIdentificador: '', tipo: '' },
  });

  useEffect(() => {
    if (abierto) {
      reset({
        numeroIdentificador: inmuebleInicial?.numeroIdentificador ?? '',
        tipo: inmuebleInicial?.tipo ?? '',
      });
    }
  }, [abierto, inmuebleInicial, reset]);

  const onSubmit = async (valores) => {
    try {
      if (esCreacion) {
        await crearInmueble(valores);
        mostrarNotificacion('Inmueble creado correctamente.');
      } else {
        await actualizarInmueble(inmuebleInicial.id, valores);
        mostrarNotificacion('Inmueble actualizado correctamente.');
      }
      onGuardado();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible guardar el inmueble.', 'error');
    }
  };

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="xs">
      <DialogTitle>{esCreacion ? 'Nuevo inmueble' : 'Editar inmueble'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <FormTextField name="numeroIdentificador" control={control} label="Numero identificador" autoFocus />
          <FormSelectField name="tipo" control={control} label="Tipo" opciones={OPCIONES_TIPO} />
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
