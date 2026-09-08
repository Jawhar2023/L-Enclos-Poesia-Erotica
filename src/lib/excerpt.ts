export function excerpt(text: string, lines = 6) {
  if (!text) return "";
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .slice(0, lines)
    .join("\n");
}

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
export const TONES = ["pistachio", "sky", "rose", "butter"] as const;

export function doorForIndex(index: number) {
  return {
    numeral: ROMAN[index] || String(index + 1),
    tone: TONES[index % TONES.length],
  };
}
