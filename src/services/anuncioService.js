import httpClient from '../api/httpClient';

/** Contrato exacto de AnuncioController (backend). */

export async function crearAnuncio(payload) {
  const { data } = await httpClient.post('/api/anuncios', payload);
  return data.data;
}

export async function actualizarAnuncio(id, payload) {
  const { data } = await httpClient.put(`/api/anuncios/${id}`, payload);
  return data.data;
}

export async function eliminarAnuncio(id) {
  await httpClient.delete(`/api/anuncios/${id}`);
}

export async function listarAnuncios({ page = 0, size = 10 } = {}) {
  const { data } = await httpClient.get('/api/anuncios', { params: { page, size } });
  return data.data;
}
