import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export function SelectorMisInmuebles({ inmuebles, valor, onCambiar }) {
  if (inmuebles.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Tabs value={valor} onChange={(_evento, nuevoValor) => onCambiar(nuevoValor)} variant="scrollable">
        {inmuebles.map((inmueble) => (
          <Tab key={inmueble.id} value={inmueble.id} label={inmueble.numeroIdentificador} />
        ))}
      </Tabs>
    </Box>
  );
}
