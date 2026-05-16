/**
 * @file HomeStatusGrid.tsx - 귀가 체크인 멤버 상태 그리드
 *
 * 멤버별 귀가 상태를 그리드로 표시.
 * ✅ 집 / 🚖 이동중 / ❓ 대기
 */
import Character from '@/components/common/Character'
import type { CharacterBreed } from '@/types/room'

type HomeState = 'home' | 'moving' | 'pending'

const stateConfig: Record<HomeState, { emoji: string; label: string; className: string }> = {
  home: { emoji: '✅', label: '집', className: 'text-success' },
  moving: { emoji: '🚖', label: '이동중', className: 'text-warning opacity-70' },
  pending: { emoji: '❓', label: '대기', className: 'text-brown-400 opacity-50' },
}

interface Member {
  nickname: string
  breed: CharacterBreed
  state: HomeState
  arrivedAt?: string
}

interface HomeStatusGridProps {
  members: Member[]
}

export default function HomeStatusGrid({ members }: HomeStatusGridProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {members.map((m) => {
        const config = stateConfig[m.state]
        return (
          <div key={m.nickname} className="text-center">
            <div className={m.state !== 'home' ? 'opacity-60' : ''}>
              <Character breed={m.breed} level={0} size="sm" showBadge={false} showEffects={false} />
            </div>
            <div className="font-display text-xs mt-1">{m.nickname}</div>
            <div className={`text-[10px] ${config.className}`}>
              {config.emoji} {m.arrivedAt ?? config.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
