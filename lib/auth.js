export function deleteToken(token) {
  const validToken = process.env.DELETE_TOKEN; // Stellen Sie sicher, dass diese Umgebungsvariable gesetzt ist
  return token === validToken;
}

export function loadAllNewsToken(token) {
  const validToken = process.env.LOAD_ALL_NEWS_TOKEN; // Stellen Sie sicher, dass diese Umgebungsvariable gesetzt ist
  return token === validToken;
}
