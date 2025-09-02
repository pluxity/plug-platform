export function formatKoreanDateTime(ts?: string) {
  if (!ts) return ''
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ts || ''
  const fmt = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(d)
  return fmt
    .replace(/\s*오전\s*/g, ' ')
    .replace(/\s*오후\s*/, ' ')
    .replace(/\.\s/g, '.')
    .replace(/\.$/, '')
}
