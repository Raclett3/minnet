function range(length: number) {
  return [...Array(length).keys()];
}

function random(maximum: number) {
  return Math.floor(Math.random() * maximum);
}

export function generateId(length = 16) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');

  return range(length).reduce(acc => acc + characters[random(characters.length)], '');
}
