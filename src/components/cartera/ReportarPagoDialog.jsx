import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { FormTextField } from '../forms/FormTextField';
import { useSnackbar } from '../../hooks/useSnackbar';
import { reportarPago } from '../../services/pagoService';

const EXTENSIONES_PERMITIDAS = ['pdf', 'jpg', 'jpeg', 'png'];

const esquema = z.object({
  montoPagado: z.coerce.number({ message: 'Ingresa un monto valido' }).positive('El monto debe ser mayor a cero'),
  fechaPago: z.string().min(1, 'La fecha de pago es obligatoria'),
  metodoPago: z.string().max(50, 'Maximo 50 caracteres').optional(),
});

export function ReportarPagoDialog({ abierto, cobroId, onCerrar, onGuardado }) {
  const { mostrarNotificacion } = useSnackbar();
  const [archivo, setArchivo] = useState(null);
  const [errorArchivo, setErrorArchivo] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { montoPagado: '', fechaPago: '', metodoPago: '' },
  });

  const manejarCierre = () => {
    reset({ montoPagado: '', fechaPago: '', metodoPago: '' });
    setArchivo(null);
    setErrorArchivo(null);
    onCerrar();
  };

  const manejarSeleccionArchivo = (evento) => {
    const archivoSeleccionado = evento.target.files?.[0];
    if (!archivoSeleccionado) {
      setArchivo(null);
      return;
    }
    const extension = archivoSeleccionado.name.split('.').pop()?.toLowerCase();
    if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
      setErrorArchivo('El soporte debe ser un archivo PDF, JPG o PNG.');
      setArchivo(null);
      return;
    }
    setErrorArchivo(null);
    setArchivo(archivoSeleccionado);
  };

  const onSubmit = async (valores) => {
    if (!archivo) {
      setErrorArchivo('Debes adjuntar el soporte del pago.');
      return;
    }
    try {
      await reportarPago(cobroId, valores, archivo);
      mostrarNotificacion('Pago reportado. Queda pendiente de verificacion.');
      manejarCierre();
      onGuardado();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible reportar el pago.', 'error');
    }
  };

  return (
    <Dialog open={abierto} onClose={manejarCierre} fullWidth maxWidth="xs">
      <DialogTitle>Reportar pago</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <FormTextField name="montoPagado" control={control} label="Monto pagado" type="number" autoFocus />
          <FormTextField name="fechaPago" control={control} label="Fecha de pago" type="date" InputLabelProps={{ shrink: true }} />
          <FormTextField name="metodoPago" control={control} label="Metodo de pago (opcional)" />

          <Button component="label" variant="outlined" startIcon={<UploadFileOutlinedIcon />} sx={{ mt: 1 }} fullWidth>
            {archivo ? archivo.name : 'Adjuntar soporte (PDF, JPG o PNG)'}
            <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={manejarSeleccionArchivo} />
          </Button>
          {errorArchivo && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errorArchivo}
            </Alert>
          )}
          {!errorArchivo && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Formatos aceptados: PDF, JPG, PNG.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={manejarCierre} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Reportar pago
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
