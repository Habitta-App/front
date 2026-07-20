import httpClient from '../api/httpClient';

/**
 * Contratos exactos de PagoController y VerificacionPagoController
 * (backend). El reporte de pago viaja como multipart/form-data con dos
 * partes: "datos" (JSON) y "soporte" (archivo). No se fija manualmente el
 * header Content-Type: axios detecta automaticamente un FormData y deja que
 * el navegador calcule el boundary del multipart.
 */

export async function reportarPago(cobroId, datosPago, archivoSoporte) {
  const formData = new FormData();

  // Spring Boot requiere que el JSON sea enviado como un Blob
  // con el media type application/json cuando se usa una parte que es un DTO
  const jsonBlob = new Blob([JSON.stringify(datosPago)], { type: 'application/json' });
  formData.append('datos', jsonBlob);
  formData.append('soporte', archivoSoporte);

  // Aseguramos de que el Content-Type para la request sea multipart/form-data.
  // No necesitamos fijar explícitamente headers en axios porque si mandas un FormData,
  // Axios y el Navegador lo hacen por ti, pero hay que observar el servidor.
  const { data } = await httpClient.post(`/api/cobros/${cobroId}/pagos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
}

export async function listarPagosPorCobro(cobroId) {
  const { data } = await httpClient.get(`/api/cobros/${cobroId}/pagos`);
  return data.data;
}

export async function listarPagosEnVerificacion() {
  const { data } = await httpClient.get('/api/pagos/en-verificacion');
  return data.data;
}

export async function aprobarPago(pagoId) {
  const { data } = await httpClient.patch(`/api/pagos/${pagoId}/aprobar`);
  return data.data;
}

export async function rechazarPago(pagoId) {
  const { data } = await httpClient.patch(`/api/pagos/${pagoId}/rechazar`);
  return data.data;
}

/** Devuelve un Blob (el navegador ya reconoce el Content-Type real desde la respuesta). */
export async function descargarSoportePago(pagoId) {
  const { data } = await httpClient.get(`/api/pagos/${pagoId}/soporte`, { responseType: 'blob' });
  return data;
}
