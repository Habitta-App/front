import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerRutaInicioPorRol } from './routesConfig';

export function InicioRedirect() {
  return <Navigate to={obtenerRutaInicioPorRol()} replace />;
}
