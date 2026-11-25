const UNSAFE_HTML_PATTERN =
  /<\s*\/?\s*(script|iframe|object|embed|svg|style|img|link|meta)\b|javascript\s*:|on\w+\s*=|<[^>]*>/i;

/**
 * HTML 태그, script 태그, 이벤트 핸들러 등 XSS 위험 패턴이 포함되어 있는지 검사합니다.
 */
export function hasUnsafeHtml(value: string): boolean {
  return UNSAFE_HTML_PATTERN.test(value);
}

/**
 * 입력 문자열의 앞뒤 공백을 제거하고 HTML 특수문자(<, >)를 안전한 텍스트로 치환합니다.
 */
export function sanitizePlainText(value: string): string {
  return value
    .trim()
    .replace(/</g, '＜')
    .replace(/>/g, '＞');
}
