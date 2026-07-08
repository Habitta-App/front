import axios from 'axios';
import { obtenerToken, limpiarSesion } from '../utils/tokenStorage';

const RUTA_LOGIN = '/login';

/**
 * Instancia unica de Axios para todo el frontend. Es deliberadamente
 * "tonta": solo resuelve transporte HTTP (base URL, token, normalizacion
 * de errores). No conoce la forma de ApiResponse<T> del backend ni
 * desenvuelve `response.data.data`, porque no todos los endpoints la usan
 * (ej. la descarga de soporte de pago devuelve el archivo crudo). Cada
 * servicio en src/services/ es responsable de interpretar la forma exacta
 * de la respuesta de su propio endpoint.
 */
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = obtenerToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token ausente, invalido o expirado (rechazado por JwtAuthenticationFilter
    // o por @PreAuthorize): se cierra la sesion y se redirige a login. El
    // backend no expone un endpoint de renovacion de token (ver blueprint,
    // estrategia de autenticacion), asi que no hay reintento posible.
    if (status === 401 && window.location.pathname !== RUTA_LOGIN) {
      limpiarSesion();
      window.location.assign(RUTA_LOGIN);
    }

    return Promise.reject(normalizarError(error));
  },
);

function normalizarError(error) {
  const cuerpoError = error.response?.data;

  if (cuerpoError?.message) {
    return {
      mensaje: cuerpoError.message,
      status: error.response.status,
      erroresDeCampo: cuerpoError.erroresDeCampo ?? null,
    };
  }

  if (error.request && !error.response) {
    return {
      mensaje: 'No fue posible conectar con el servidor. Verifica que el backend este disponible.',
      status: null,
      erroresDeCampo: null,
    };
  }

  return {
    mensaje: 'Ocurrio un error inesperado.',
    status: error.response?.status ?? null,
    erroresDeCampo: null,
  };
}

export default httpClient;
