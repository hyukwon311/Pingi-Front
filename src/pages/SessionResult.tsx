/**
 * @file SessionResult.tsx - 핑이타임 결과 페이지
 *
 * 핑이타임 측정 후 모든 멤버의 취도 변화를 확인하는 결과 화면이다.
 * 상단에는 가장 많이 취한 사람(1위)의 캐릭터가 하이라이트 카드로 표시되고,
 * 하단에는 전체 순위 테이블이 나타나 각 멤버의 레벨 변화(▲+1, ▲+2 등)를 보여준다.
 * 공복으로 시작한 멤버가 있다면 하단에 경고 메시지가 표시되어 식사를 권유한다.
 * 핑이타임마다 이 화면을 통해 누가 가장 빨리 취하는지 실시간으로 확인할 수 있다.
 */
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import { BREEDS, LEVEL_INFO } from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'

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

  // TODO: API에서 결과 데이터 받기
  const pingiTimeNumber = 3
  const results: ResultMember[] = [
    { memberId: '1', nickname: '민준', breed: 'retriever', level: 4, levelChange: 2 },
    { memberId: '2', nickname: '수진', breed: 'pomeranian', level: 3, levelChange: 1, isHungry: true },
    { memberId: '3', nickname: '지훈', breed: 'shiba', level: 2, levelChange: 0 },
    { memberId: '4', nickname: '수아', breed: 'poodle', level: 0, levelChange: 0, isNotDrinking: true },
  ]

  const winner = results[0]
  const hungryMember = results.find((r) => r.isHungry)

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
            {winner.nickname} ({BREEDS[winner.breed as keyof typeof BREEDS].name})
          </p>
          <p className="text-sm text-ink font-bold mt-1">
            Level {winner.level} · ▲ +{winner.levelChange} 단계
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
