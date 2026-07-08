import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService';
import { guardarSesion, obtenerToken, obtenerUsuarioAlmacenado, limpiarSesion } from '../utils/tokenStorage';
import { tokenExpirado } from '../utils/jwt';

export const AuthContext = createContext(null);

/**
 * Unica fuente de verdad de la sesion en toda la app. Se inicializa desde
 * localStorage (persistencia del JWT) y valida expiracion al cargar; el
 * httpClient se encarga de la expiracion detectada a mitad de sesion
 * (interceptor 401).
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const token = obtenerToken();
    const usuarioAlmacenado = obtenerUsuarioAlmacenado();

    if (token && usuarioAlmacenado && !tokenExpirado(token)) {
      setUsuario(usuarioAlmacenado);
    } else {
      limpiarSesion();
    }

    setCargandoSesion(false);
  }, []);

  const iniciarSesion = useCallback(async (email, password) => {
    const { token, usuario: usuarioAutenticado } = await loginRequest(email, password);
    guardarSesion(token, usuarioAutenticado);
    setUsuario(usuarioAutenticado);
    return usuarioAutenticado;
  }, []);

  const cerrarSesion = useCallback(() => {
    limpiarSesion();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      estaAutenticado: Boolean(usuario),
      cargandoSesion,
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, cargandoSesion, iniciarSesion, cerrarSesion],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
