import { Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export function FormCheckbox({ name, control, label }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={<Checkbox {...field} checked={Boolean(field.value)} />}
          label={label}
        />
      )}
    />
  );
}
