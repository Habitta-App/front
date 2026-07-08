import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { PageHeader } from '../../components/common/PageHeader';
import { FormTextField } from '../../components/forms/FormTextField';
import { LoadingState } from '../../components/feedback/LoadingState';
import { useSnackbar } from '../../hooks/useSnackbar';
import { obtenerPerfilActual, actualizarEmail, cambiarPassword } from '../../services/perfilService';

const esquemaEmail = z.object({
  nuevoEmail: z.string().min(1, 'El correo es obligatorio').email('Correo electronico invalido'),
  passwordActual: z.string().min(1, 'Debes confirmar tu contrasena actual'),
});

const esquemaPassword = z
  .object({
    passwordActual: z.string().min(1, 'Debes confirmar tu contrasena actual'),
    passwordNueva: z.string().min(8, 'La nueva contrasena debe tener al menos 8 caracteres'),
    confirmarPasswordNueva: z.string().min(1, 'Confirma la nueva contrasena'),
  })
  .refine((valores) => valores.passwordNueva === valores.confirmarPasswordNueva, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmarPasswordNueva'],
  });

export function MiPerfilPage() {
  const { mostrarNotificacion } = useSnackbar();
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarPerfil = async () => {
    setCargando(true);
    try {
      const datos = await obtenerPerfilActual();
      setPerfil(datos);
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible cargar tu perfil.', 'error');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formularioEmail = useForm({
    resolver: zodResolver(esquemaEmail),
    defaultValues: { nuevoEmail: '', passwordActual: '' },
  });

  const formularioPassword = useForm({
    resolver: zodResolver(esquemaPassword),
    defaultValues: { passwordActual: '', passwordNueva: '', confirmarPasswordNueva: '' },
  });

  const onSubmitEmail = async (valores) => {
    try {
      const actualizado = await actualizarEmail(valores.nuevoEmail, valores.passwordActual);
      setPerfil(actualizado);
      formularioEmail.reset({ nuevoEmail: '', passwordActual: '' });
      mostrarNotificacion('Correo actualizado correctamente.');
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible actualizar el correo.', 'error');
    }
  };

  const onSubmitPassword = async (valores) => {
    try {
      await cambiarPassword(valores.passwordActual, valores.passwordNueva);
      formularioPassword.reset({ passwordActual: '', passwordNueva: '', confirmarPasswordNueva: '' });
      mostrarNotificacion('Contrasena actualizada correctamente.');
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible cambiar la contrasena.', 'error');
    }
  };

  if (cargando) {
    return <LoadingState mensaje="Cargando tu perfil..." />;
  }

  return (
    <Box>
      <PageHeader titulo="Mi Perfil" subtitulo="Consulta tus datos y actualiza tu correo o contrasena" />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Datos actuales
        </Typography>
        <Typography variant="body2">
          <strong>Nombre:</strong> {perfil.nombre}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          <strong>Correo:</strong> {perfil.email}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label={perfil.rol} size="small" color="primary" variant="outlined" />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Actualizar correo electronico
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Box component="form" onSubmit={formularioEmail.handleSubmit(onSubmitEmail)} noValidate>
              <FormTextField name="nuevoEmail" control={formularioEmail.control} label="Nuevo correo electronico" />
              <FormTextField
                name="passwordActual"
                control={formularioEmail.control}
                label="Contrasena actual"
                type="password"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={formularioEmail.formState.isSubmitting}
                sx={{ mt: 1 }}
              >
                Guardar correo
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Cambiar contrasena
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Box component="form" onSubmit={formularioPassword.handleSubmit(onSubmitPassword)} noValidate>
              <FormTextField
                name="passwordActual"
                control={formularioPassword.control}
                label="Contrasena actual"
                type="password"
              />
              <FormTextField
                name="passwordNueva"
                control={formularioPassword.control}
                label="Nueva contrasena"
                type="password"
              />
              <FormTextField
                name="confirmarPasswordNueva"
                control={formularioPassword.control}
                label="Confirmar nueva contrasena"
                type="password"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={formularioPassword.formState.isSubmitting}
                sx={{ mt: 1 }}
              >
                Cambiar contrasena
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
