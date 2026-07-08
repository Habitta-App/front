import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export function EmptyState({ mensaje = 'No hay informacion para mostrar.' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        py: 6,
        color: 'text.secondary',
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 48 }} />
      <Typography>{mensaje}</Typography>
    </Box>
  );
}
