/**
 * @file Awards.tsx - 시상식 페이지
 *
 * 술자리 종료 후 각 멤버에게 수여되는 다양한 상과 통계를 보여주는 화면이다.
 * 고정 4대상(주량왕, 최고 레벨, 최저 레벨, 센스왕)과
 * 조건부 뱃지(공복왕, 야식왕, 소주왕 등)가 멤버별로 표시되며,
 * 시간대별 취도 변화 그래프를 통해 술자리 동안의 취도 흐름을 한눈에 파악할 수 있다.
 * 하단의 "인스타 카드 만들기" 버튼을 누르면 결과를 이미지로 저장할 수 있다.
 */
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import Character from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'

interface AwardWinner {
  nickname: string
  breed: CharacterBreed
  description: string
}

interface BadgeInfo {
  emoji: string
  name: string
  winner: string
  reason: string
}

export default function Awards() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()

  // TODO: API에서 시상 데이터 받기
  const sessionInfo = {
    date: '2026.05.16',
    place: '강남',
  }

  const awards: { title: string; icon: string; label: string; winner: AwardWinner }[] = [
    { title: '술짱', icon: '🏆', label: '오늘의 술짱', winner: { nickname: '민준', breed: 'retriever', description: 'Level 5 달성' } },
    { title: '간수호자', icon: '🛡️', label: '오늘의 간수호자', winner: { nickname: '수아', breed: 'poodle', description: '끝까지 Level 1 사수' } },
    { title: '페이스메이커', icon: '😎', label: '오늘의 페이스메이커', winner: { nickname: '지훈', breed: 'shiba', description: 'Level 3에서 멈춤' } },
    { title: '급발진', icon: '🚀', label: '오늘의 급발진', winner: { nickname: '수진', breed: 'pomeranian', description: '레벨 상승 속도 1위' } },
  ]

  const badges: BadgeInfo[] = [
    { emoji: '🫠', name: '알쓰', winner: '민준', reason: '첫 핑이타임 L2' },
    { emoji: '🚂', name: '폭주기관차', winner: '민준', reason: '3회차 +2' },
    { emoji: '💀', name: '공복전사', winner: '수진', reason: '공복 + L3 도달' },
  ]

  // 시간별 레벨 데이터 (간단한 시각화)
  const timelineData = [
    { time: '19:30', levels: [0, 0, 0, 0] },
    { time: '20:00', levels: [1, 1, 0, 0] },
    { time: '20:30', levels: [2, 2, 1, 0] },
    { time: '21:00', levels: [4, 3, 2, 1] },
    { time: '21:30', levels: [5, 4, 3, 1] },
  ]

  const levelColors = ['bg-lv-0', 'bg-lv-1', 'bg-lv-2', 'bg-lv-3', 'bg-lv-4', 'bg-lv-5']

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
        <div className="grid grid-cols-2 gap-3">
          {awards.map((award, idx) => (
            <Card key={award.title} className="text-center" highlight={idx === 0}>
              <p className="text-xs text-brown-500 mb-1">
                {award.icon} {award.label}
              </p>
              <Character
                breed={award.winner.breed}
                level={idx === 0 ? 5 : idx === 1 ? 1 : 3}
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

        <div className="divider" />

        {/* 뱃지 */}
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

        <div className="divider" />

        {/* 시간별 그래프 */}
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
                      className={`w-2 rounded-t ${levelColors[lv]}`}
                      style={{ height: `${((lv + 1) / 6) * 100}%` }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-3 text-[9px] text-brown-400">
              <span>🐶 민준</span>
              <span>🐶 수진</span>
              <span>🐶 지훈</span>
              <span>🐶 수아</span>
            </div>
          </Card>
        </div>

        <div className="mt-auto pt-6">
          <Button onClick={() => navigate(`/r/${code}/share`)}>
            📸 인스타 카드 만들기
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
