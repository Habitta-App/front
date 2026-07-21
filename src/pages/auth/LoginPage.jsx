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
import Link from '@mui/material/Link';
import { FormTextField } from '../../components/forms/FormTextField';
import { useAuth } from '../../hooks/useAuth';
import { obtenerRutaInicioPorRol } from '../../routes/routesConfig';
import { crearUsuario } from '../../services/usuarioService';
import { useSnackbar } from '../../hooks/useSnackbar';

const esquemaLogin = z.object({
  email: z.string().min(1, 'El correo electronico es obligatorio').email('Correo electronico invalido'),
  password: z.string().min(1, 'La contrasena es obligatoria'),
});

const esquemaRegistro = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().min(1, 'El correo electronico es obligatorio').email('Correo electronico invalido'),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
  confirmarPassword: z.string().min(1, 'Debes confirmar tu contrasena'),
}).refine((data) => data.password === data.confirmarPassword, {
  message: "Las contrasenas no coinciden",
  path: ["confirmarPassword"],
});

export function LoginPage() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mostrarNotificacion } = useSnackbar();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorAccion, setErrorAccion] = useState(null);

  const formLogin = useForm({
    resolver: zodResolver(esquemaLogin),
    defaultValues: { email: '', password: '' },
  });

  const formRegistro = useForm({
    resolver: zodResolver(esquemaRegistro),
    defaultValues: { nombre: '', email: '', password: '', confirmarPassword: '' },
  });

  const onSubmitLogin = async ({ email, password }) => {
    setErrorAccion(null);
    try {
      const usuarioAutenticado = await iniciarSesion(email, password);
      const destinoOriginal = location.state?.desde;
      navigate(destinoOriginal ?? obtenerRutaInicioPorRol(usuarioAutenticado.rol), { replace: true });
    } catch (error) {
      setErrorAccion(error.mensaje ?? 'No fue posible iniciar sesion.');
    }
  };

  const onSubmitRegistro = async (valores) => {
    setErrorAccion(null);
    try {
      // Forzamos el rol "RESIDENTE" desde el cliente
      const payload = {
        nombre: valores.nombre,
        email: valores.email,
        passwordTemporal: valores.password,
        rol: 'RESIDENTE'
      };
      await crearUsuario(payload);
      mostrarNotificacion('Registro exitoso. Ahora puedes iniciar sesion.', 'success');
      formRegistro.reset();
      setIsRegistering(false);
    } catch (error) {
      setErrorAccion(error.mensaje ?? 'Error al intentar crear la cuenta.');
    }
  };

  const toggleModo = () => {
    setIsRegistering(!isRegistering);
    setErrorAccion(null);
    formLogin.reset();
    formRegistro.reset();
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
      <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box component="img" src="/favicon.svg" alt="Habitta Logo" sx={{ width: 64, height: 64, mb: 2 }} />
        <Typography variant="h5" fontWeight={600} sx={{ textAlign: 'center' }} gutterBottom>
          Habitta-app
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          {isRegistering ? 'Crea tu cuenta de residente' : 'Inicia sesion para continuar'}
        </Typography>

        {errorAccion && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {errorAccion}
          </Alert>
        )}

        {!isRegistering ? (
          <Box key="login-form" component="form" onSubmit={formLogin.handleSubmit(onSubmitLogin)} noValidate sx={{ width: '100%' }}>
            <FormTextField name="email" control={formLogin.control} label="Correo electronico" autoFocus autoComplete="email" />
            <FormTextField
              name="password"
              control={formLogin.control}
              label="Contrasena"
              type="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={formLogin.formState.isSubmitting}
              sx={{ mt: 2 }}
              startIcon={formLogin.formState.isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {formLogin.formState.isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Box>
        ) : (
          <Box key="registro-form" component="form" onSubmit={formRegistro.handleSubmit(onSubmitRegistro)} noValidate sx={{ width: '100%' }}>
            <FormTextField name="nombre" control={formRegistro.control} label="Nombre Completo" autoFocus />
            <FormTextField name="email" control={formRegistro.control} label="Correo electronico" autoComplete="email" />
            <FormTextField
              name="password"
              control={formRegistro.control}
              label="Contrasena"
              type="password"
            />
            <FormTextField
              name="confirmarPassword"
              control={formRegistro.control}
              label="Confirmar contrasena"
              type="password"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={formRegistro.formState.isSubmitting}
              sx={{ mt: 2 }}
              startIcon={formRegistro.formState.isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {formRegistro.formState.isSubmitting ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Box>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
            {' '}
            <Link
              component="button"
              variant="body2"
              onClick={toggleModo}
              sx={{ fontWeight: 'bold', textDecoration: 'none' }}
            >
              {isRegistering ? 'Iniciar sesion' : 'Registrarse aqui'}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
