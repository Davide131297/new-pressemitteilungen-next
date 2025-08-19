export default function sendLogs(
  level: string,
  msg: string,
  labels: Record<string, string>
) {
  return fetch('/api/loki', {
    method: 'POST',
    body: JSON.stringify({ level, msg, labels }),
  });
}
