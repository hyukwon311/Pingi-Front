/**
 * @file routes.ts - 라우트 경로 상수
 *
 * 앱 내 모든 페이지의 URL 경로를 상수로 관리한다.
 * 경로를 하드코딩하지 않고 이 상수를 참조하여 오타를 방지한다.
 */
export const ROUTES = {
  SPLASH: '/',                              // 스플래시 (앱 시작 화면)
  LOGIN: '/login',                          // 로그인 (닉네임 입력)
  HOME: '/home',                            // 홈 화면
  HISTORY: '/history',                      // 술자리 기록 목록
  MYPAGE: '/mypage',                        // 마이페이지
  SESSION_CREATE: '/session/create',        // 새 술자리 생성
  SESSION_JOIN: '/session/join',            // 초대 코드로 참가
  SESSION_WAITING: '/session/:id/waiting',  // 대기실
  SESSION_BASELINE: '/session/:id/baseline',// 기준 발음 측정
  SESSION_RECORD: '/session/:id/record',    // 발음 테스트 녹음
  SESSION_DASHBOARD: '/session/:id',        // 세션 대시보드
  SESSION_RESULT: '/session/:id/result',    // 세션 결과 화면
} as const
