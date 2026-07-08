import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import { Link } from 'react-router-dom';

export function NoEncontradoPage() {
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
      <SearchOffOutlinedIcon sx={{ fontSize: 64 }} color="disabled" />
      <Typography variant="h5" fontWeight={600}>
        Pagina no encontrada
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Volver al inicio
      </Button>
    </Box>
  );
}
