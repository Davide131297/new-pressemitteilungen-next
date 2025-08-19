export default function sendLogs(level: string, msg: string) {
  return fetch('/api/loki', {
    method: 'POST',
    body: JSON.stringify({ level, msg }),
  });
}
