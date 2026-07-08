import { useEffect, useState } from 'react';
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
import { FormSelectField } from '../../../components/forms/FormSelectField';
import { FormCheckbox } from '../../../components/forms/FormCheckbox';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { vincularUsuario } from '../../../services/vinculacionService';
import { listarUsuarios } from '../../../services/usuarioService';

const esquema = z.object({
  usuarioId: z.string().min(1, 'Selecciona un residente'),
  esPropietario: z.boolean(),
});

export function VincularUsuarioDialog({ abierto, inmuebleId, onCerrar, onGuardado }) {
  const { mostrarNotificacion } = useSnackbar();
  const [residentes, setResidentes] = useState([]);
  const [cargandoResidentes, setCargandoResidentes] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { usuarioId: '', esPropietario: false },
  });

  useEffect(() => {
    if (!abierto) {
      return;
    }
    reset({ usuarioId: '', esPropietario: false });

    setCargandoResidentes(true);
    listarUsuarios({ page: 0, size: 200 })
      .then((respuesta) => {
        const soloResidentesActivos = respuesta.content.filter(
          (usuario) => usuario.rol === 'RESIDENTE' && usuario.activo,
        );
        setResidentes(soloResidentesActivos);
      })
      .catch(() => setResidentes([]))
      .finally(() => setCargandoResidentes(false));
  }, [abierto, reset]);

  const opcionesResidentes = residentes.map((residente) => ({
    value: String(residente.id),
    label: `${residente.nombre} (${residente.email})`,
  }));

  const onSubmit = async (valores) => {
    try {
      await vincularUsuario(inmuebleId, {
        usuarioId: Number(valores.usuarioId),
        esPropietario: valores.esPropietario,
      });
      mostrarNotificacion('Usuario vinculado correctamente.');
      onGuardado();
    } catch (error) {
      mostrarNotificacion(error.mensaje ?? 'No fue posible vincular al usuario.', 'error');
    }
  };

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="xs">
      <DialogTitle>Vincular usuario</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <FormSelectField
            name="usuarioId"
            control={control}
            label="Residente"
            opciones={opcionesResidentes}
            disabled={cargandoResidentes}
          />
          {(cargandoResidentes || opcionesResidentes.length === 0) && (
            <Typography variant="caption" color="text.secondary">
              {cargandoResidentes ? 'Cargando residentes...' : 'No hay residentes activos disponibles.'}
            </Typography>
          )}
          <FormCheckbox name="esPropietario" control={control} label="Es propietario (si no, queda como residente actual)" />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCerrar} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Vincular
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
