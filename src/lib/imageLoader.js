const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8080";
const isProd = process.env.NODE_ENV === "production";

export default function imageLoader({ src }) {
  if (!src) return "/mcp-fallback.png";

  // 절대 URL은 그대로
  if (/^https?:\/\//i.test(src)) return src;

  // /files/... 또는 /mcp/... → dev는 프록시, prod는 API_BASE 붙이기
  if (src.startsWith("/files") || src.startsWith("/mcp")) {
    return isProd ? `${API_BASE}${src}` : `/__img${src}`;
  }

  // 상대경로(files/...) → dev는 프록시, prod는 API_BASE 붙이기
  if (!src.startsWith("/")) {
    return isProd ? `${API_BASE}/${src}` : `/__img/${src}`;
  }

  // 그 외는 그대로 반환
  return src;
}
