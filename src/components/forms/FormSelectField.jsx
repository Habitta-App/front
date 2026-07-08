import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export function FormSelectField({ name, control, label, opciones, ...resto }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...resto}
          select
          label={label}
          fullWidth
          margin="normal"
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? ' '}
        >
          {opciones.map((opcion) => (
            <MenuItem key={opcion.value} value={opcion.value}>
              {opcion.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
