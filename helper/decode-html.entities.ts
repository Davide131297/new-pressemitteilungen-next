export function decodeHTMLEntities(text: string): string {
  return text.replace(/&([a-zA-Z]+);/g, (match, entity) => {
    const entities: Record<string, string> = {
      amp: '&',
      lt: '<',
      gt: '>',
      quot: '"',
      apos: "'",
      auml: 'ä',
      ouml: 'ö',
      uuml: 'ü',
      szlig: 'ß',
      Auml: 'Ä',
      Ouml: 'Ö',
      Uuml: 'Ü',
      nbsp: ' ',
    };
    return entities[entity] || match;
  });
}
