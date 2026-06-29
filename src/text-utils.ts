// 서버 공통 텍스트 유틸.

/**
 * JSON 코드펜스(```json ... ```)를 벗긴 뒤 JSON.parse. 실패 시 null.
 */
export function safeJsonParse(s: string): Record<string, unknown> | null {
  try {
    const cleaned = s
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}
