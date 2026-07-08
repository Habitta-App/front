import httpClient from '../api/httpClient';

/** Contrato exacto de ReporteCarteraController (backend, ADMIN y CONSEJO). */
export async function generarReporteCartera() {
  const { data } = await httpClient.get('/api/reportes/cartera');
  return data.data;
}
