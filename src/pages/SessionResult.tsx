/**
 * @file SessionResult.tsx - 핑이타임 결과 페이지
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import { BREEDS } from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'
import { getRoom, getCurrentMemberId } from '@/services/api'

interface ResultMember {
  memberId: string
  nickname: string
  breed: CharacterBreed
  level: number
  levelChange: number
  isNotDrinking?: boolean
  isHungry?: boolean
}

export default function SessionResult() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [results, setResults] = useState<ResultMember[]>([])
  const [pingiTimeNumber, setPingiTimeNumber] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResults() {
      if (!code) return
      try {
        const room = await getRoom(code)
        
        // 멤버 데이터에서 결과 생성
        const memberResults: ResultMember[] = room.members
          .map(m => ({
            memberId: m.id,
            nickname: m.nickname,
            breed: (m.breed || 'retriever') as CharacterBreed,
            level: m.level ?? 0,
            levelChange: 0, // 실제로는 이전 레벨과 비교해야 함
            isHungry: (m.hungerLevel ?? 0) >= 3,
          }))
          .sort((a, b) => b.level - a.level)
        
        setResults(memberResults)
        
        // 핑이타임 번호는 location state에서 가져오거나 기본값 사용
        const stateIndex = (location.state as { pingiTimeIndex?: number })?.pingiTimeIndex
        setPingiTimeNumber(stateIndex ?? 1)
      } catch (error) {
        console.error('Failed to fetch results:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [code, location.state])

  const winner = results[0]
  const hungryMember = results.find((r) => r.isHungry)

  if (loading || !winner) {
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
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-xl text-brown-900">
            🌀 핑이타임 #{pingiTimeNumber} 결과
          </h1>
        </div>

        {/* 1위 카드 */}
        <Card highlight className="mt-6 text-center relative overflow-visible">
          <span className="absolute -top-2 -right-2 text-2xl">🔥</span>
          <p className="text-xs text-brown-500 mb-3">🏆 가장 많이 취한 사람</p>
          <Character 
            breed={winner.breed} 
            level={winner.level as 0|1|2|3|4|5} 
            size="lg" 
            showEffects 
          />
          <p className="font-display text-lg text-brown-900 mt-3">
            {winner.nickname} ({BREEDS[winner.breed as keyof typeof BREEDS]?.name || winner.breed})
          </p>
          <p className="text-sm text-ink font-bold mt-1">
            Level {winner.level}
            {winner.levelChange > 0 && ` · ▲ +${winner.levelChange} 단계`}
          </p>
        </Card>

        <div className="divider" />

        {/* 전체 순위 */}
        <div>
          <p className="text-sm font-bold text-brown-900 mb-3">전체 순위</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-card">
            {results.map((r, idx) => (
              <div
                key={r.memberId}
                className={`flex items-center px-4 py-3 ${
                  idx !== results.length - 1 ? 'border-b border-brown-100' : ''
                }`}
              >
                <span className={`w-8 font-display text-sm ${idx < 2 ? 'text-ink' : 'text-brown-400'}`}>
                  {idx + 1}위
                </span>
                <div className="w-10 flex justify-center">
                  <Character 
                    breed={r.breed} 
                    level={r.level as 0|1|2|3|4|5} 
                    size="xs" 
                    showEffects={false} 
                  />
                </div>
                <span className="flex-1 ml-2 font-display text-sm text-brown-900">
                  {r.nickname}
                </span>
                <span className="font-display text-sm text-brown-700 mr-2">
                  L{r.level}
                </span>
                <span className={`text-sm font-bold ${
                  r.levelChange > 0 ? 'text-ink' : 'text-brown-400'
                }`}>
                  {r.levelChange > 0 ? `(+${r.levelChange})` : '(=)'}
                </span>
                {r.isNotDrinking && (
                  <span className="ml-2 text-xs text-brown-400">※안마심</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 공복 경고 */}
        {hungryMember && (
          <div className="mt-4 px-4 py-3 bg-highlight/20 rounded-xl">
            <p className="text-sm text-brown-700 text-center">
              🥺 공복으로 시작한 {hungryMember.nickname}, 밥 좀 든든하게 먹어요 🍚
            </p>
          </div>
        )}

        <div className="mt-auto pt-6">
          <Button onClick={() => navigate(`/r/${code}/live`)}>
            확인
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
