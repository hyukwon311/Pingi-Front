/**
 * @file share.ts - 공유 기능 유틸리티
 *
 * 초대 코드를 친구에게 공유하는 기능.
 * Web Share API를 지원하면 네이티브 공유 시트를 띄우고,
 * 미지원 환경에서는 클립보드에 복사한다.
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
