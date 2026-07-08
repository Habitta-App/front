import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { obtenerRutaInicioPorRol } from '../../routes/routesConfig';

export function AccesoDenegadoPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        textAlign: 'center',
        px: 2,
      }}
    >
      <BlockOutlinedIcon sx={{ fontSize: 64 }} color="error" />
      <Typography variant="h5" fontWeight={600}>
        No tienes permisos para ver esta pagina
      </Typography>
      <Typography color="text.secondary">Tu rol actual no incluye acceso a esta seccion.</Typography>
      <Button variant="contained" onClick={() => navigate(obtenerRutaInicioPorRol(usuario?.rol))}>
        Volver al inicio
      </Button>
    </Box>
  );
}
