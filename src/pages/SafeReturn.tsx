/**
 * @file SafeReturn.tsx - 무사 귀가 리포트 페이지
 *
 * 모든 멤버가 안전하게 귀가했음을 확인하고 오늘 술자리를 마무리하는 최종 화면이다.
 * 상단에 축하 메시지와 함께 각 멤버의 귀가 완료 상태가 표시되고,
 * 중간에는 오늘의 통계(총 잔수, 핑이타임 횟수, 최고 레벨 등)가 요약 카드로 나타난다.
 * "홈으로" 버튼을 누르면 앱의 메인 화면으로 돌아가며,
 * 이로써 한 번의 술자리 세션이 완전히 종료된다.
 */
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'

interface MemberArrival {
  nickname: string
  breed: CharacterBreed
  arrivedAt?: string
  isHome: boolean
}

export default function SafeReturn() {
  const navigate = useNavigate()

  // TODO: API에서 데이터 받기
  const members: MemberArrival[] = [
    { nickname: '민준', breed: 'retriever', arrivedAt: '23:12', isHome: true },
    { nickname: '수진', breed: 'pomeranian', arrivedAt: '23:34', isHome: true },
    { nickname: '지훈', breed: 'shiba', arrivedAt: '23:08', isHome: true },
    { nickname: '수아', breed: 'poodle', arrivedAt: '23:45', isHome: true },
  ]

  const stats = {
    pingiTimeCount: 6,
    maxLevelNickname: '민준',
    maxLevel: 5,
  }

  const homeCount = members.filter((m) => m.isHome).length
  const pendingMembers = members.filter((m) => !m.isHome)
  const allHome = pendingMembers.length === 0

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          {allHome ? (
            <>
              <div className="text-5xl mb-3">✅</div>
              <h1 className="font-display text-2xl text-brown-900">
                {homeCount}명 모두 무사 귀가
              </h1>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">⚠️</div>
              <h1 className="font-display text-2xl text-brown-900">
                {pendingMembers.length}명 미확인
              </h1>
              <p className="text-sm text-warning mt-1">
                {pendingMembers.map((m) => m.nickname).join(', ')}
              </p>
            </>
          )}
        </div>

        <Card className="mt-6">
          <div className="flex flex-col gap-2">
            {members.map((m) => (
              <div
                key={m.nickname}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <Character breed={m.breed} level={0} size="xs" showBadge={false} showEffects={false} />
                  <span className="font-display text-sm text-brown-900">
                    {m.nickname}
                  </span>
                </div>
                <span className={`text-sm ${m.isHome ? 'text-success' : 'text-brown-400'}`}>
                  {m.isHome ? `✅ ${m.arrivedAt} 도착` : '❓ 대기'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="divider" />

        <Card>
          <div className="text-center">
            <p className="text-sm text-brown-500">
              오늘 총 핑이타임: <span className="font-bold text-brown-900">{stats.pingiTimeCount}회</span>
            </p>
            <p className="text-sm text-brown-500 mt-1">
              최고 레벨: <span className="font-bold text-brown-900">{stats.maxLevelNickname} L{stats.maxLevel}</span>
            </p>
          </div>
        </Card>

        <div className="mt-auto pt-6">
          <Button onClick={() => navigate('/')}>
            오늘 다 끝!
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
