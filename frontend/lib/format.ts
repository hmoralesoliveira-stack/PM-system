// Datas no app são armazenadas em 'YYYY-MM-DD' (padrão da API/inputs de data);
// esta função converte para o formato brasileiro dd/mm/aaaa exigido na exibição.
export function formatDateBR(dateStr?: string | null): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.slice(0, 10).split('-');
  if (!y || !m || !d) return dateStr;
  return `${d}/${m}/${y}`;
}
