const patterns: Array<{ name: string; regex: RegExp }> = [
  { name: "NIF", regex: /\b\d{10,15}\b/g },
  { name: "NIS", regex: /\b\d{9,12}\b/g },
  { name: "RC", regex: /\bRC\s?\d{4,}\b/gi },
  { name: "EMAIL", regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi },
  { name: "AMOUNT", regex: /\b\d+[.,]?\d*\s?(DA|DZD|EUR|USD)\b/gi },
];

function redactText(text: string): string {
  let output = text;
  for (const pattern of patterns) {
    output = output.replace(pattern.regex, `[REDACTED_${pattern.name}]`);
  }
  return output;
}

export function stripPayload(input: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      result[key] = redactText(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? redactText(item) : item
      );
    } else if (value && typeof value === "object") {
      result[key] = stripPayload(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}
