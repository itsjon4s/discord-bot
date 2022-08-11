export function shorten(text: string, size: number): string {
  if (typeof text !== 'string') return '';
  if (text.length <= size) return text;
  return `${text.slice(0, size).trim()}...`;
}
