import httpClient from '../api/httpClient';

/** Contratos exactos de CobroController e InmuebleCobroController (backend). */

export async function generarCobrosMasivos() {
  const { data } = await httpClient.post('/api/cobros/generar-masivo');
  return data.data;
}

export async function obtenerCobroPorId(id) {
  const { data } = await httpClient.get(`/api/cobros/${id}`);
  return data.data;
}

export async function listarCobrosPorInmueble(inmuebleId, { page = 0, size = 10 } = {}) {
  const { data } = await httpClient.get(`/api/inmuebles/${inmuebleId}/cobros`, { params: { page, size } });
  return data.data;
}
