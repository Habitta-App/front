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
import { registrarIngresoDirecto } from '../../services/visitaService';

const esquema = z.object({
  inmuebleId: z.coerce.number({ invalid_type_error: 'Debe ser un número' }).min(1, 'El ID de la unidad es obligatorio'),
  nombreVisitante: z.string().min(1, 'El nombre del visitante es obligatorio').max(150),
  fechaEsperada: z.string().min(1, 'La fecha es obligatoria'),
});

export function RegistrarVisitaGuardaDialog({ abierto, onCerrar, onGuardado }) {
  const { mostrarNotificacion } = useSnackbar();

  const hoyFormatoLocal = new Date().toISOString().split('T')[0];

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { inmuebleId: '', nombreVisitante: '', fechaEsperada: hoyFormatoLocal },
  });

  const manejarCierre = () => {
    reset({ inmuebleId: '', nombreVisitante: '', fechaEsperada: hoyFormatoLocal });
    onCerrar();
  };

  const onSubmit = async (valores) => {
    try {
      // El guarda registra un ingreso inesperado, se asume que no requiere anuncio o ya lo anunció por citófono
      const payload = {
        nombreVisitante: valores.nombreVisitante,
        fechaEsperada: valores.fechaEsperada,
        requiereAnuncio: false,
      };
      await registrarIngresoDirecto(valores.inmuebleId, payload);
      mostrarNotificacion('Visitante registrado e ingresado al instante.');
      manejarCierre();
      onGuardado();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible registrar al visitante.', 'error');
    }
  };

  return (
    <Dialog open={abierto} onClose={manejarCierre} fullWidth maxWidth="xs" disableEnforceFocus>
      <DialogTitle>Ingreso sin cita previa</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <FormTextField name="inmuebleId" control={control} label="ID de la unidad (destino)" autoFocus type="number" />
          <FormTextField name="nombreVisitante" control={control} label="Nombre del visitante" />
          <FormTextField
            name="fechaEsperada"
            control={control}
            label="Fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
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
