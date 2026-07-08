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
import { registrarPaquete } from '../../services/paqueteService';

const esquema = z.object({
  descripcion: z.string().min(1, 'La descripcion es obligatoria').max(300, 'Maximo 300 caracteres'),
});

export function RegistrarPaqueteDialog({ abierto, inmuebleId, onCerrar, onGuardado }) {
  const { mostrarNotificacion } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ resolver: zodResolver(esquema), defaultValues: { descripcion: '' } });

  const manejarCierre = () => {
    reset({ descripcion: '' });
    onCerrar();
  };

  const onSubmit = async (valores) => {
    try {
      await registrarPaquete(inmuebleId, valores);
      mostrarNotificacion('Paquete registrado correctamente.');
      manejarCierre();
      onGuardado();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible registrar el paquete.', 'error');
    }
  };

  return (
    <Dialog open={abierto} onClose={manejarCierre} fullWidth maxWidth="xs">
      <DialogTitle>Registrar paquete</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <FormTextField
            name="descripcion"
            control={control}
            label="Descripcion del paquete"
            multiline
            rows={3}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={manejarCierre} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Registrar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
