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
import { FormCheckbox } from '../../components/forms/FormCheckbox';
import { useSnackbar } from '../../hooks/useSnackbar';
import { autorizarVisita } from '../../services/visitaService';

const esquema = z.object({
  nombreVisitante: z.string().min(1, 'El nombre del visitante es obligatorio').max(150),
  requiereAnuncio: z.boolean(),
  fechaEsperada: z.string().min(1, 'La fecha esperada es obligatoria'),
});

export function AutorizarVisitaDialog({ abierto, inmuebleId, onCerrar, onGuardado }) {
  const { mostrarNotificacion } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { nombreVisitante: '', requiereAnuncio: false, fechaEsperada: '' },
  });

  const manejarCierre = () => {
    reset({ nombreVisitante: '', requiereAnuncio: false, fechaEsperada: '' });
    onCerrar();
  };

  const onSubmit = async (valores) => {
    try {
      await autorizarVisita(inmuebleId, valores);
      mostrarNotificacion('Visitante autorizado correctamente.');
      manejarCierre();
      onGuardado();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible autorizar al visitante.', 'error');
    }
  };

  return (
    <Dialog open={abierto} onClose={manejarCierre} fullWidth maxWidth="xs">
      <DialogTitle>Autorizar visitante</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <FormTextField name="nombreVisitante" control={control} label="Nombre del visitante" autoFocus />
          <FormTextField
            name="fechaEsperada"
            control={control}
            label="Fecha esperada"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <FormCheckbox name="requiereAnuncio" control={control} label="El guarda debe anunciarlo antes de dejarlo pasar" />
        </DialogContent>
        <DialogActions>
          <Button onClick={manejarCierre} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Autorizar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
