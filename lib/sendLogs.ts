export default function sendLogs(
  level: string,
  msg: string,
  type?: string,
  city?: string,
  state?: string
) {
  return fetch('/api/loki', {
    method: 'POST',
    body: JSON.stringify({ level, msg, type, city, state }),
  });
}
