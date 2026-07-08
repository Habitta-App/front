import httpClient from '../api/httpClient';

/** Contratos exactos de VisitaController y ControlAccesoController (backend). */

export async function autorizarVisita(inmuebleId, payload) {
  const { data } = await httpClient.post(`/api/inmuebles/${inmuebleId}/visitas`, payload);
  return data.data;
}

export async function registrarIngresoDirecto(inmuebleId, payload) {
  const { data } = await httpClient.post(`/api/inmuebles/${inmuebleId}/visitas/ingreso-directo`, payload);
  return data.data;
}

export async function listarVisitasPorInmueble(inmuebleId, { page = 0, size = 10 } = {}) {
  const { data } = await httpClient.get(`/api/inmuebles/${inmuebleId}/visitas`, { params: { page, size } });
  return data.data;
}

export async function buscarVisitasProgramadas(nombre) {
  const { data } = await httpClient.get('/api/visitas/buscar', { params: { nombre } });
  return data.data;
}

export async function listarTodasVisitas({ page = 0, size = 10, nombre, inmuebleId, fechaIngreso } = {}) {
  const params = { page, size };
  if (nombre) params.nombre = nombre;
  if (inmuebleId) params.inmuebleId = inmuebleId;
  if (fechaIngreso) params.fechaIngreso = fechaIngreso;

  const { data } = await httpClient.get('/api/visitas', { params });
  return data.data;
}

export async function marcarIngresoVisita(visitaId) {
  const { data } = await httpClient.patch(`/api/visitas/${visitaId}/marcar-ingreso`);
  return data.data;
}

export async function marcarSalidaVisita(visitaId) {
  const { data } = await httpClient.patch(`/api/visitas/${visitaId}/marcar-salida`);
  return data.data;
}
