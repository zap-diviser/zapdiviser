export function maskValue(valor, mascara) {
  const valorLimpo = valor.replace(/\D/g, '');
  let resultado = '';
  let indiceValor = 0;

  for (let i = 0; i < mascara.length && indiceValor < valorLimpo.length; i++) {
      if (mascara[i] === '#') {
          resultado += valorLimpo[indiceValor++];
      } else {
          resultado += mascara[i];
      }
  }

  return resultado;
}