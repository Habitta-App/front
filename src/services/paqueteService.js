import httpClient from '../api/httpClient';

/** Contratos exactos de PaqueteController y EntregaPaqueteController (backend). */

export async function registrarPaquete(inmuebleId, payload) {
  const { data } = await httpClient.post(`/api/inmuebles/${inmuebleId}/paquetes`, payload);
  return data.data;
}

export async function listarPaquetesPorInmueble(inmuebleId, { page = 0, size = 10 } = {}) {
  const { data } = await httpClient.get(`/api/inmuebles/${inmuebleId}/paquetes`, { params: { page, size } });
  return data.data;
}

export async function entregarPaquete(paqueteId) {
  const { data } = await httpClient.patch(`/api/paquetes/${paqueteId}/entregar`);
  return data.data;
}
