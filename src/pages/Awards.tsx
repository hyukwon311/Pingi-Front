/**
 * @file Awards.tsx - 시상식 페이지
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Character from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'
import { getFinalReport, getRoom, endRoom } from '@/services/api'
import { useRoom } from '@/contexts/RoomContext'

interface AwardWinner {
  nickname: string
  breed: CharacterBreed
  description: string
}

interface AwardData {
  title: string
  icon: string
  label: string
  winner: AwardWinner
  level: number
}

interface BadgeInfo {
  emoji: string
  name: string
  winner: string
  reason: string
}

const AWARD_CONFIG: Record<string, { title: string; icon: string; label: string }> = {
  top_drunk: { title: '술짱', icon: '🏆', label: '오늘의 술짱' },
  liver_guardian: { title: '간수호자', icon: '🛡️', label: '오늘의 간수호자' },
  pacemaker: { title: '페이스메이커', icon: '😎', label: '오늘의 페이스메이커' },
  accelerator: { title: '급발진', icon: '🚀', label: '오늘의 급발진' },
}

export default function Awards() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { currentMember } = useRoom()
  
  const [awards, setAwards] = useState<AwardData[]>([])
  const [badges, setBadges] = useState<BadgeInfo[]>([])
  const [timelineData, setTimelineData] = useState<{ time: string; levels: number[] }[]>([])
  const [memberNames, setMemberNames] = useState<string[]>([])
  const [sessionInfo, setSessionInfo] = useState({ date: '', place: '' })
  const [loading, setLoading] = useState(true)
  const [ending, setEnding] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!code) return
      try {
        // 먼저 방 정보 가져오기
        const room = await getRoom(code)
        setSessionInfo({
          date: new Date(room.scheduledAt).toLocaleDateString('ko-KR'),
          place: room.location,
        })
        setMemberNames(room.members.map(m => m.nickname))
        
        // 리포트 가져오기 (방이 종료된 경우에만 실제 데이터가 있음)
        try {
          const report = await getFinalReport(code)
          
          // Awards 매핑
          const mappedAwards: AwardData[] = report.awards.map((a, idx) => {
            const config = AWARD_CONFIG[a.type] || { title: a.type, icon: '🎖️', label: a.type }
            return {
              ...config,
              winner: {
                nickname: a.nickname,
                breed: (a.breed || 'retriever') as CharacterBreed,
                description: a.description,
              },
              level: idx === 0 ? 5 : idx === 1 ? 1 : 3,
            }
          })
          setAwards(mappedAwards)
          
          // Badges 매핑
          setBadges(report.badges.map(b => ({
            emoji: b.emoji,
            name: b.name,
            winner: b.winner,
            reason: b.reason,
          })))
          
          // Timeline 매핑
          setTimelineData(report.timeline.map(t => ({
            time: new Date(t.time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            levels: t.levels,
          })))
        } catch {
          // 리포트가 없으면 멤버 데이터에서 생성
          const memberAwards: AwardData[] = []
          const sortedByLevel = [...room.members].sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
          
          if (sortedByLevel[0]) {
            memberAwards.push({
              title: '술짱',
              icon: '🏆',
              label: '오늘의 술짱',
              winner: {
                nickname: sortedByLevel[0].nickname,
                breed: (sortedByLevel[0].breed || 'retriever') as CharacterBreed,
                description: `Level ${sortedByLevel[0].level ?? 0} 달성`,
              },
              level: sortedByLevel[0].level ?? 0,
            })
          }
          
          const lowestLevel = sortedByLevel[sortedByLevel.length - 1]
          if (lowestLevel && lowestLevel.id !== sortedByLevel[0]?.id) {
            memberAwards.push({
              title: '간수호자',
              icon: '🛡️',
              label: '오늘의 간수호자',
              winner: {
                nickname: lowestLevel.nickname,
                breed: (lowestLevel.breed || 'retriever') as CharacterBreed,
                description: `Level ${lowestLevel.level ?? 0} 유지`,
              },
              level: lowestLevel.level ?? 0,
            })
          }
          
          setAwards(memberAwards)
        }
      } catch (error) {
        console.error('Failed to fetch awards:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [code])

  const handleEndSession = async () => {
    if (!code || !currentMember?.isHost) return
    setEnding(true)
    try {
      await endRoom(code)
      // 리포트 새로 가져오기
      const report = await getFinalReport(code)
      // 페이지 새로고침하여 데이터 업데이트
      window.location.reload()
    } catch (error) {
      console.error('Failed to end session:', error)
    } finally {
      setEnding(false)
    }
  }

  const levelColors = ['bg-lv-0', 'bg-lv-1', 'bg-lv-2', 'bg-lv-3', 'bg-lv-4', 'bg-lv-5']

  if (loading) {
    return (
      <PageTransition>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-brown-500">로딩 중...</p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col overflow-y-auto">
        <div className="text-center">
          <h1 className="font-display text-2xl text-brown-900">
            🎉 오늘의 술자리 결과
          </h1>
          <p className="text-sm text-brown-500 mt-1">
            {sessionInfo.date} · {sessionInfo.place}
          </p>
        </div>

        <div className="divider" />

        {/* 4개 고정상 */}
        {awards.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {awards.map((award, idx) => (
              <Card key={award.title} className="text-center" highlight={idx === 0}>
                <p className="text-xs text-brown-500 mb-1">
                  {award.icon} {award.label}
                </p>
                <Character
                  breed={award.winner.breed}
                  level={Math.min(award.level, 5) as 0|1|2|3|4|5}
                  size="sm"
                  showEffects={idx === 0}
                />
                <p className="font-display text-sm text-brown-900 mt-2">
                  {award.winner.nickname}
                </p>
                <p className="text-[10px] text-brown-400 mt-0.5">
                  {award.winner.description}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-brown-500">아직 결과가 없어요</p>
          </Card>
        )}

        {badges.length > 0 && (
          <>
            <div className="divider" />
            <div>
              <p className="text-sm font-bold text-brown-900 mb-2">🎖 획득 뱃지</p>
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => (
                  <Badge key={b.name} variant="highlight">
                    {b.emoji} {b.name}: {b.winner}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {timelineData.length > 0 && (
          <>
            <div className="divider" />
            <div>
              <p className="text-sm font-bold text-brown-900 mb-3">📈 시간별 그래프</p>
              <Card>
                <div className="flex justify-between text-[10px] text-brown-400 mb-2">
                  {timelineData.map((t) => (
                    <span key={t.time}>{t.time}</span>
                  ))}
                </div>
                <div className="h-24 flex items-end justify-between gap-1">
                  {timelineData.map((t, i) => (
                    <div key={i} className="flex-1 flex items-end justify-center gap-0.5">
                      {t.levels.map((lv, j) => (
                        <div
                          key={j}
                          className={`w-2 rounded-t ${levelColors[Math.min(lv, 5)]}`}
                          style={{ height: `${((lv + 1) / 6) * 100}%` }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-2 mt-3 text-[9px] text-brown-400">
                  {memberNames.map((name, i) => (
                    <span key={i}>🐶 {name}</span>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <Button onClick={() => navigate(`/r/${code}/share`)}>
            📸 인스타 카드 만들기
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
