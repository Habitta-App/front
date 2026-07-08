import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingState } from '../components/feedback/LoadingState';

/**
 * Protege rutas a nivel de router (no solo oculta opciones de menu con
 * CSS). `rolesPermitidos` es opcional: si se omite, solo exige estar
 * autenticado (cualquier rol).
 */
export function ProtectedRoute({ rolesPermitidos }) {
  const { estaAutenticado, cargandoSesion, usuario } = useAuth();
  const location = useLocation();

  if (cargandoSesion) {
    return <LoadingState mensaje="Verificando sesion..." />;
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" state={{ desde: location.pathname }} replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
