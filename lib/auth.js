export function deleteToken(token) {
  const validToken = process.env.DELETE_TOKEN;
  return token === validToken;
}

export function loadAllNewsToken(token) {
  const validToken = process.env.LOAD_ALL_NEWS_TOKEN;
  return token === validToken;
}
