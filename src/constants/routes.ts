/**
 * @file routes.ts - 라우트 경로 상수
 *
 * 핑이 앱의 모든 페이지 URL 경로를 상수로 관리하여 하드코딩을 방지한다.
 * 로그인 없이 방 코드(roomCode) 기반으로 동작하며,
 * 메인 홈("/"), 방 생성("/new"), 방 참여("/r/:code") 등의 경로와
 * 각 방 내부의 세부 플로우 경로(캐릭터 선택, 대기실, 술자리 진행, 결과 등)를 포함한다.
 * getRoomPath() 헬퍼 함수를 사용하면 방 코드를 인자로 받아 특정 페이지 경로를 쉽게 생성할 수 있다.
 */
export const ROUTES = {
  // 메인
  MAIN: '/',                                  // 메인 (방 만들기 or 코드 입력)
  NEW: '/new',                                // 방 만들기

  // 방 플로우 (roomCode 기반)
  ROOM: '/r/:code',                           // 방 입장 (초대 정보 + 닉네임 입력)
  CHARACTER: '/r/:code/character',            // 캐릭터 선택
  ARRIVAL: '/r/:code/arrival',                // 도착 정보 입력
  LOBBY: '/r/:code/lobby',                    // 대기 화면
  CONFIRM: '/r/:code/confirm',                // 캐릭터 확인
  BASELINE: '/r/:code/baseline',              // 베이스라인 녹음
  LIVE: '/r/:code/live',                      // 술자리 메인
  AWARDS: '/r/:code/awards',                  // 시상식
  SHARE: '/r/:code/share',                    // 인스타 카드
  HOME_CHECKIN: '/r/:code/home',              // 귀가 체크인
  DONE: '/r/:code/done',                      // 무사 귀가
} as const

/**
 * 방 코드를 포함한 경로 생성 헬퍼
 */
export const getRoomPath = (route: string, code: string) => {
  return route.replace(':code', code)
}
