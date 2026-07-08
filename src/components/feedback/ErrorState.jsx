import Alert from '@mui/material/Alert';

export function ErrorState({ mensaje = 'Ocurrio un error al cargar la informacion.' }) {
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      {mensaje}
    </Alert>
  );
}
