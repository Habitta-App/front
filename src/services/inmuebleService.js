import httpClient from '../api/httpClient';

/** Contratos exactos de InmuebleController y MisInmueblesController (backend). */

export async function crearInmueble(payload) {
  const { data } = await httpClient.post('/api/inmuebles', payload);
  return data.data;
}

export async function obtenerInmueblePorId(id) {
  const { data } = await httpClient.get(`/api/inmuebles/${id}`);
  return data.data;
}

export async function listarInmuebles({ page = 0, size = 10 } = {}) {
  const { data } = await httpClient.get('/api/inmuebles', { params: { page, size } });
  return data.data;
}

export async function actualizarInmueble(id, payload) {
  const { data } = await httpClient.put(`/api/inmuebles/${id}`, payload);
  return data.data;
}

export async function desactivarInmueble(id) {
  const { data } = await httpClient.patch(`/api/inmuebles/${id}/desactivar`);
  return data.data;
}

export async function activarInmueble(id) {
  const { data } = await httpClient.patch(`/api/inmuebles/${id}/activar`);
  return data.data;
}

/** Inmuebles vinculados al usuario autenticado (usado por el rol RESIDENTE). */
export async function listarMisInmuebles() {
  const { data } = await httpClient.get('/api/inmuebles/mis-inmuebles');
  return data.data;
}
