import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function PageHeader({ titulo, subtitulo, accion }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={600}>
          {titulo}
        </Typography>
        {subtitulo && (
          <Typography variant="body2" color="text.secondary">
            {subtitulo}
          </Typography>
        )}
      </Box>
      {accion}
    </Box>
  );
}
