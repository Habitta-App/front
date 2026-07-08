/**
 * Decodifica el payload de un JWT (base64url) sin librerias externas: el
 * unico uso es leer el claim `exp` para detectar expiracion proactivamente,
 * ya que el backend no expone un endpoint de renovacion (ver httpClient.js).
 */
export function decodificarJwt(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadNormalizado = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = atob(payloadNormalizado);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export function tokenExpirado(token) {
  const payload = decodificarJwt(token);
  if (!payload?.exp) {
    return true;
  }
  const ahoraEnSegundos = Date.now() / 1000;
  return payload.exp < ahoraEnSegundos;
}
