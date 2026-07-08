export function abrirBlobEnNuevaPestana(blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  // Se libera despues de un momento para darle tiempo al navegador de abrirlo.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
