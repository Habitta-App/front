const CLAVE_TOKEN = 'habitta_app_token';
const CLAVE_USUARIO = 'habitta_app_usuario';

/**
 * Persistencia de la sesion (RNF-3, JWT). El backend no expone un
 * mecanismo de sesion por cookies ni un endpoint de renovacion de token
 * (ver blueprint, estrategia de autenticacion), por lo que localStorage es
 * el unico mecanismo de persistencia disponible para una SPA stateless
 * como esta.
 */
export function guardarSesion(token, usuario) {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function obtenerUsuarioAlmacenado() {
  const usuarioSerializado = localStorage.getItem(CLAVE_USUARIO);
  return usuarioSerializado ? JSON.parse(usuarioSerializado) : null;
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
}
