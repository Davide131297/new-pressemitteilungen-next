export function verifyToken(token) {
  const validToken = process.env.DELETE_TOKEN; // Stellen Sie sicher, dass diese Umgebungsvariable gesetzt ist
  return token === validToken;
}
