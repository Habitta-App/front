import { createTheme } from '@mui/material/styles';

/**
 * Tema unico de la aplicacion. Cualquier ajuste visual global (colores,
 * tipografia, radios) se hace aqui, nunca con estilos sueltos repetidos
 * en cada componente (DRY).
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1F6F5C',
    },
    secondary: {
      main: '#2D3A4A',
    },
    background: {
      default: '#F4F6F8',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
