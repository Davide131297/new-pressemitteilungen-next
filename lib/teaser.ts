export async function fetchTeaser(
  url: string,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // 1) <meta name="description" content="...">
    const m = html.match(
      /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i
    );
    if (m?.[1]) return m[1].trim();

    const m2 = html.match(
      /<meta[^>]+name=["']teaser["'][^>]*content=["']([^"']+)["']/i
    );
    if (m2?.[1]) return m2[1].trim();

    const m3 = html.match(
      /<meta[^>]+name=["']dcterms\.title["'][^>]*content=["']([^"']+)["']/i
    );
    if (m3?.[1]) return m3[1].trim();

    return null;
  } catch {
    return null;
  }
}
