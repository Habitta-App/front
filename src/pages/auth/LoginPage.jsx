import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { FormTextField } from '../../components/forms/FormTextField';
import { useAuth } from '../../hooks/useAuth';
import { obtenerRutaInicioPorRol } from '../../routes/routesConfig';

const esquemaLogin = z.object({
  email: z.string().min(1, 'El correo electronico es obligatorio').email('Correo electronico invalido'),
  password: z.string().min(1, 'La contrasena es obligatoria'),
});

export function LoginPage() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorLogin, setErrorLogin] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(esquemaLogin),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async ({ email, password }) => {
    setErrorLogin(null);
    try {
      const usuarioAutenticado = await iniciarSesion(email, password);
      const destinoOriginal = location.state?.desde;
      navigate(destinoOriginal ?? obtenerRutaInicioPorRol(usuarioAutenticado.rol), { replace: true });
    } catch (error) {
      setErrorLogin(error.mensaje ?? 'No fue posible iniciar sesion.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" fontWeight={600} sx={{ textAlign: 'center' }} gutterBottom>
          Habitta-app
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }} mb={3}>
          Inicia sesion para continuar
        </Typography>

        {errorLogin && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorLogin}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormTextField name="email" control={control} label="Correo electronico" autoFocus autoComplete="email" />
          <FormTextField
            name="password"
            control={control}
            label="Contrasena"
            type="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
