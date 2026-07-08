import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export function LoadingState({ mensaje = 'Cargando...' }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 6 }}>
      <CircularProgress />
      <Typography color="text.secondary">{mensaje}</Typography>
    </Box>
  );
}
