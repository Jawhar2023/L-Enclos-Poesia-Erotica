function chunkText(text: string, max = 420) {
  const lines = text.split("\n");
  const chunks: string[] = [];
  let current = "";
  for (const line of lines) {
    const next = current ? `${current}\n${line}` : line;
    if (next.length > max && current) {
      chunks.push(current);
      current = line;
    } else {
      current = next;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateChunk(text: string) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("translate failed");
  const data = (await res.json()) as unknown;
  const rows = Array.isArray(data) ? data[0] : null;
  if (!Array.isArray(rows)) throw new Error("bad payload");
  return rows
    .map((row) => (Array.isArray(row) && typeof row[0] === "string" ? row[0] : ""))
    .join("");
}

export async function translateFrToAr(text: string) {
  const source = text.trim();
  if (!source) return "";
  const parts = chunkText(source);
  const translated: string[] = [];
  for (const part of parts) {
    if (!part.trim()) {
      translated.push(part);
      continue;
    }
    translated.push(await translateChunk(part));
  }
  return translated.join("\n").trim();
}
