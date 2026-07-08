import httpClient from '../api/httpClient';

/** Contratos exactos de UsuarioController (backend, exclusivo ADMIN). */

export async function crearUsuario(payload) {
  const { data } = await httpClient.post('/api/usuarios', payload);
  return data.data;
}

export async function obtenerUsuarioPorId(id) {
  const { data } = await httpClient.get(`/api/usuarios/${id}`);
  return data.data;
}

export async function listarUsuarios({ page = 0, size = 10 } = {}) {
  const { data } = await httpClient.get('/api/usuarios', { params: { page, size } });
  return data.data;
}

export async function actualizarUsuario(id, payload) {
  const { data } = await httpClient.put(`/api/usuarios/${id}`, payload);
  return data.data;
}

export async function desactivarUsuario(id) {
  const { data } = await httpClient.patch(`/api/usuarios/${id}/desactivar`);
  return data.data;
}

export async function activarUsuario(id) {
  const { data } = await httpClient.patch(`/api/usuarios/${id}/activar`);
  return data.data;
}
