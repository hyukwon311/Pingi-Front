/**
 * @file SafeReturn.tsx - 무사 귀가 리포트 페이지
 *
 * 모든 멤버가 안전하게 귀가했음을 확인하고 오늘 술자리를 마무리하는 최종 화면이다.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'
import { getRoom, getFinalReport } from '@/services/api'
import { useWebSocket } from '@/hooks/useWebSocket'

interface MemberArrival {
  id: string
  nickname: string
  breed: CharacterBreed
  arrivedAt?: string
  isHome: boolean
}

export default function SafeReturn() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [members, setMembers] = useState<MemberArrival[]>([])
  const [stats, setStats] = useState({ pingiTimeCount: 0, maxLevelNickname: '', maxLevel: 0 })
  const [loading, setLoading] = useState(true)

  // WebSocket 연결 - 귀가 상태 실시간 업데이트
  useWebSocket({
    roomCode: code || '',
    autoNavigate: false,
  })

  useEffect(() => {
    async function fetchData() {
      if (!code) return
      try {
        const [room, report] = await Promise.all([
          getRoom(code),
          getFinalReport(code).catch(() => null),
        ])

        // 멤버 귀가 상태 설정 (homeCheckin 데이터 기반)
        setMembers(room.members.map(m => ({
          id: m.id,
          nickname: m.nickname,
          breed: (m.breed || 'retriever') as CharacterBreed,
          arrivedAt: (m as any).homeCheckinAt ? new Date((m as any).homeCheckinAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : undefined,
          isHome: !!(m as any).homeCheckinAt,
        })))

        // 통계 계산
        const sortedByLevel = [...room.members].sort((a, b) => b.level - a.level)
        const maxMember = sortedByLevel[0]
        
        setStats({
          pingiTimeCount: report?.timeline?.length || 0,
          maxLevelNickname: maxMember?.nickname || '',
          maxLevel: maxMember?.level || 0,
        })
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    // 5초마다 새로고침
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [code])

  if (loading) {
    return (
      <PageTransition>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-brown-500">로딩 중...</p>
        </div>
      </PageTransition>
    )
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
