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
import { crearUsuario, actualizarUsuario } from '../../../services/usuarioService';

const OPCIONES_ROL = [
  { value: 'RESIDENTE', label: 'Residente' },
  { value: 'CONSEJO', label: 'Consejo' },
  { value: 'GUARDA', label: 'Guarda de Seguridad' },
];

const esquemaCrear = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(150),
  email: z.string().min(1, 'El correo es obligatorio').email('Correo electronico invalido'),
  passwordTemporal: z.string().min(8, 'Debe tener al menos 8 caracteres'),
  rol: z.enum(['RESIDENTE', 'CONSEJO', 'GUARDA'], { message: 'Selecciona un rol' }),
});

const esquemaEditar = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(150),
});

export function UsuarioFormDialog({ abierto, modo, usuarioInicial, onCerrar, onGuardado }) {
  const { mostrarNotificacion } = useSnackbar();
  const esCreacion = modo === 'crear';

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(esCreacion ? esquemaCrear : esquemaEditar),
    defaultValues: esCreacion
      ? { nombre: '', email: '', passwordTemporal: '', rol: '' }
      : { nombre: '' },
  });

  useEffect(() => {
    if (abierto) {
      reset(esCreacion ? { nombre: '', email: '', passwordTemporal: '', rol: '' } : { nombre: usuarioInicial?.nombre ?? '' });
    }
  }, [abierto, esCreacion, usuarioInicial, reset]);

  const onSubmit = async (valores) => {
    try {
      if (esCreacion) {
        await crearUsuario(valores);
        mostrarNotificacion('Usuario creado correctamente.');
      } else {
        await actualizarUsuario(usuarioInicial.id, valores);
        mostrarNotificacion('Usuario actualizado correctamente.');
      }
      onGuardado();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible guardar el usuario.', 'error');
    }
  };

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="xs" disableEnforceFocus>
      <DialogTitle>{esCreacion ? 'Nuevo usuario' : 'Editar usuario'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <FormTextField name="nombre" control={control} label="Nombre completo" autoFocus />
          {esCreacion && (
            <>
              <FormTextField name="email" control={control} label="Correo electronico" />
              <FormTextField name="passwordTemporal" control={control} label="Contrasena temporal" type="password" />
              <FormSelectField name="rol" control={control} label="Rol" opciones={OPCIONES_ROL} />
            </>
          )}
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
