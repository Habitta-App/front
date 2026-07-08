import httpClient from '../api/httpClient';

/** Contratos exactos de PerfilController (backend). */

export async function obtenerPerfilActual() {
  const { data } = await httpClient.get('/api/perfil');
  return data.data;
}

export async function actualizarEmail(nuevoEmail, passwordActual) {
  const { data } = await httpClient.patch('/api/perfil/email', { nuevoEmail, passwordActual });
  return data.data;
}

export async function cambiarPassword(passwordActual, passwordNueva) {
  const { data } = await httpClient.patch('/api/perfil/password', { passwordActual, passwordNueva });
  return data.data;
}
