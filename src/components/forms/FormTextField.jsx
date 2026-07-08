import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

export function FormTextField({ name, control, label, type = 'text', multiline = false, rows, ...resto }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...resto}
          label={label}
          type={type}
          multiline={multiline}
          rows={rows}
          fullWidth
          margin="normal"
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? ' '}
        />
      )}
    />
  );
}
