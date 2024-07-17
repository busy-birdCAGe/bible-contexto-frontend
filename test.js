export function encodeGameToken(token) {
  return btoa(`${token.gameId},${token.wordId}`);
}

export function generateGameUrl(wordId) {
  const gameId = "s" + Math.random().toString(36).slice(-9);
  const gameToken = { gameId, wordId };
  const encodedToken = encodeGameToken(gameToken);
  return `${encodedToken}`;
}

console.log(generateGameUrl("b6ed12be-27fd-4765-8399-cdf156bbaa93"));
