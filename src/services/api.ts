/**
 * @file api.ts - HTTP API 클라이언트 (공통 fetch 래퍼)
 *
 * 백엔드 서버와 통신하기 위한 범용 HTTP 클라이언트.
 * 환경변수 VITE_API_URL로 서버 주소를 설정하며,
 * 기본값은 로컬 개발 서버(localhost:8080)이다.
 *
 * 모든 API 호출은 이 모듈의 api 객체를 통해 수행된다.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

/**
 * 범용 HTTP 요청 함수.
 * Content-Type을 JSON으로 설정하고, 응답이 실패하면 에러를 던진다.
 * @param endpoint - API 경로 (예: '/sessions')
 * @param options - fetch 옵션 + 쿼리 파라미터
 * @returns 파싱된 JSON 응답
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options
  let url = `${BASE_URL}${endpoint}`
  if (params) {
    url += '?' + new URLSearchParams(params).toString()
  }

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...fetchOptions.headers },
    ...fetchOptions,
  })

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

/** HTTP 메서드별 단축 함수를 제공하는 API 클라이언트 */
export const api = {
  /** GET 요청 (데이터 조회) */
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { params }),
  /** POST 요청 (데이터 생성) */
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  /** PUT 요청 (데이터 수정) */
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  /** DELETE 요청 (데이터 삭제) */
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}
