/**
 * @file SessionListCard.tsx - 세션 목록 카드 컴포넌트
 *
 * 홈 화면에서 참여 중인 세션들을 리스트 형태로 보여주는 카드.
 * 각 세션의 상태(진행중/대기중/측정중/종료)에 따라 아이콘과 색상이 달라진다.
 * 하단에는 "새 술자리 시작하기" 버튼이 항상 표시된다.
 *
 * @param sessions - 표시할 세션 배열
 */
import { useNavigate } from 'react-router-dom'
import type { Session } from '@/types/session'

interface SessionListCardProps {
  sessions: Session[]
}

/** 세션 상태별 색상·배경·라벨 설정 */
const statusConfig: Record<Session['status'], { color: string; bg: string; label: string }> = {
  active: { color: 'text-status-success', bg: 'bg-[#E8F5E9]', label: '진행중' },
  waiting: { color: 'text-pingi-500', bg: 'bg-pingi-50', label: '대기중' },
  finished: { color: 'text-grey-500', bg: 'bg-grey-100', label: '종료' },
}

/** 세션 상태에 맞는 SVG 아이콘을 렌더링하는 내부 컴포넌트 */
function SessionStatusIcon({ status }: { status: Session['status'] }) {
  const config = statusConfig[status]
  return (
    <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
      {status === 'active' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="var(--color-status-success)" />
          <circle cx="12" cy="12" r="8" stroke="var(--color-status-success)" strokeWidth="2" opacity="0.4" />
        </svg>
      )}
      {status === 'waiting' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="var(--color-pingi-500)" strokeWidth="2" />
          <path d="M12 7v5l3 2" stroke="var(--color-pingi-500)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {status === 'finished' && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke="var(--color-grey-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" stroke="var(--color-grey-500)" strokeWidth="2" />
        </svg>
      )}
    </div>
  )
}

/** 세션 상태에 따라 "입장" 또는 "결과" 텍스트를 표시하는 액션 버튼 */
function ActionButton({ status, onClick }: { status: Session['status']; onClick: () => void }) {
  const label = status === 'finished' ? '결과' : '입장'
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className="shrink-0 px-4 py-2 rounded-xl bg-grey-100 text-grey-700 text-[13px] font-semibold active:bg-grey-200 transition-colors"
    >
      {label}
    </button>
  )
}

export default function SessionListCard({ sessions }: SessionListCardProps) {
  const navigate = useNavigate()

  const handleClick = (session: Session) => {
    if (session.status === 'finished') {
      navigate(`/session/${session.id}/result`)
    } else {
      navigate(`/session/${session.id}`)
    }
  }

  return (
    <div className="mx-5 bg-white rounded-2xl overflow-hidden">
      {sessions.length === 0 ? (
        <div className="py-16 px-7 text-center">
          <p className="text-[14px] text-grey-400">아직 참여한 세션이 없어요</p>
        </div>
      ) : (
        <div className="divide-y divide-grey-100">
          {sessions.map((session) => {
            const config = statusConfig[session.status]
            return (
              <button
                key={session.id}
                onClick={() => handleClick(session)}
                className="w-full flex items-center gap-4 px-7 py-6 text-left active:bg-grey-50 transition-colors"
              >
                <SessionStatusIcon status={session.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-grey-900 truncate">{session.name}</p>
                  <p className="text-[13px] text-grey-500 mt-0.5">{session.participants.length}명 참가 · <span className={config.color}>{config.label}</span></p>
                </div>
                <ActionButton status={session.status} onClick={() => handleClick(session)} />
              </button>
            )
          })}
        </div>
      )}

      <div className="border-t border-grey-100">
        <button
          onClick={() => navigate('/session/create')}
          className="w-full flex items-center gap-4 px-7 py-6 active:bg-grey-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-pingi-50 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="var(--color-pingi-500)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="flex-1 text-[15px] font-semibold text-grey-900">새 술자리 시작하기</p>
          <span className="shrink-0 px-4 py-2 rounded-xl bg-pingi-500 text-white text-[13px] font-semibold">
            시작
          </span>
        </button>
      </div>
    </div>
  )
}
