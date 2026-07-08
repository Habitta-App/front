const FORMATEADOR_MONEDA = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const FORMATEADOR_FECHA = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' });
const FORMATEADOR_FECHA_HORA = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

export function formatearMoneda(valor) {
  return FORMATEADOR_MONEDA.format(Number(valor ?? 0));
}

export function formatearFecha(valor) {
  if (!valor) {
    return '-';
  }
  return FORMATEADOR_FECHA.format(new Date(valor));
}

export function formatearFechaHora(valor) {
  if (!valor) {
    return '-';
  }
  return FORMATEADOR_FECHA_HORA.format(new Date(valor));
}
