export function deleteToken(token) {
  const validToken = process.env.DELETE_TOKEN;
  return token === validToken;
}
