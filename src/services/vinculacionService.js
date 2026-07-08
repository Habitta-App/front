import httpClient from '../api/httpClient';

/** Contratos exactos de VinculacionController (backend, exclusivo ADMIN). */

export async function vincularUsuario(inmuebleId, payload) {
  const { data } = await httpClient.post(`/api/inmuebles/${inmuebleId}/vinculos`, payload);
  return data.data;
}

export async function listarVinculosActivos(inmuebleId) {
  const { data } = await httpClient.get(`/api/inmuebles/${inmuebleId}/vinculos`);
  return data.data;
}

export async function desvincularUsuario(inmuebleId, vinculoId) {
  const { data } = await httpClient.patch(`/api/inmuebles/${inmuebleId}/vinculos/${vinculoId}/desvincular`);
  return data.data;
}
