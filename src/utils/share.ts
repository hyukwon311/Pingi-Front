/**
 * @file share.ts - 공유 기능 유틸리티
 *
 * 방 초대 링크를 친구들에게 공유하는 기능을 제공하는 유틸리티다.
 * shareRoomLink() 함수는 방 코드를 받아 초대 링크를 생성하고,
 * 브라우저가 Web Share API를 지원하면 네이티브 공유 시트(카카오톡, 문자 등)를 띄우며,
 * 지원하지 않는 환경에서는 클립보드에 링크를 자동으로 복사하고 사용자에게 알림을 표시한다.
 * 대기실(WaitingRoom)의 "링크 공유" 버튼에서 사용되어 친구 초대를 쉽게 만든다.
 */

/**
 * 초대 코드와 세션 이름을 공유 텍스트로 만들어 공유한다.
 * @param code - 6자리 초대 코드
 * @param sessionName - 세션(술자리) 이름
 */
export async function shareInviteCode(code: string, sessionName: string) {
  const text = `🍻 핑이(Pingi) 술자리에 초대합니다!\n세션: ${sessionName}\n초대 코드: ${code}`

  if (navigator.share) {
    await navigator.share({ title: '핑이 초대', text })
  } else {
    await navigator.clipboard.writeText(text)
  }
}
