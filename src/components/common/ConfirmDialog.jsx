import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  colorConfirmar = 'primary',
  cargando = false,
  onConfirmar,
  onCancelar,
}) {
  return (
    <Dialog open={abierto} onClose={onCancelar} disableEnforceFocus>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{mensaje}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelar} disabled={cargando}>
          Cancelar
        </Button>
        <Button onClick={onConfirmar} color={colorConfirmar} variant="contained" disabled={cargando} autoFocus>
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
