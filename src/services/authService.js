import httpClient from '../api/httpClient';

/**
 * Contrato exacto de POST /api/auth/login (backend: AuthController).
 * Respuesta: ApiResponse<LoginResponse> = { data: { token, tipoToken, usuario }, message, timestamp }.
 */
export async function login(email, password) {
  const { data } = await httpClient.post('/api/auth/login', { email, password });
  return data.data;
}
