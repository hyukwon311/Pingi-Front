/**
 * @file Home.tsx - 홈 화면 (메인 대시보드)
 *
 * 로그인 후 첫 화면으로, 다음 요소들로 구성된다:
 * - 초대 코드 입장 안내 배너 (AlertBanner)
 * - 섹션 탭 (전체/대기중/진행중)으로 세션 목록 필터링
 * - 참여 중인 세션 목록 (SessionListCard)
 * - 초대 코드 직접 입력 영역
 * - 월간 참여 통계 (StatsSummaryCard)
 * - 내 프로필 요약 (ProfileCard)
 *
 * 현재 mockSessions로 더미 데이터를 사용 중이며,
 * 추후 API 연동 시 실제 데이터로 교체 필요.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import PageTransition from '@/components/layout/PageTransition'
import SessionListCard from '@/components/home/SessionListCard'
import SectionTabs from '@/components/home/SectionTabs'
import StatsSummaryCard from '@/components/home/StatsSummaryCard'
import ProfileCard from '@/components/home/ProfileCard'
import AlertBanner from '@/components/home/AlertBanner'
import type { Session } from '@/types/session'

const TABS = ['전체', '대기중', '진행중']

/** TODO: API 연동 후 제거할 더미 세션 데이터 */
const mockSessions: Session[] = [
  {
    id: '1',
    name: '금요 회식',
    hostId: '1',
    inviteCode: 'ABC123',
    status: 'active',
    participants: [
      { user: { id: '1', nickname: '나' }, drunkLevel: 1, drinkCount: 2, baselineCompleted: true, levelHistory: [] },
      { user: { id: '2', nickname: '친구1' }, drunkLevel: 2, drinkCount: 3, baselineCompleted: true, levelHistory: [] },
      { user: { id: '3', nickname: '친구2' }, drunkLevel: 1, drinkCount: 1, baselineCompleted: true, levelHistory: [] },
    ],
    createdAt: Date.now() - 3600000,
    startedAt: Date.now() - 1800000,
  },
  {
    id: '2',
    name: '동기 모임',
    hostId: '2',
    inviteCode: 'DEF456',
    status: 'waiting',
    participants: [
      { user: { id: '1', nickname: '나' }, drunkLevel: 0, drinkCount: 0, baselineCompleted: false, levelHistory: [] },
      { user: { id: '4', nickname: '동기1' }, drunkLevel: 0, drinkCount: 0, baselineCompleted: true, levelHistory: [] },
    ],
    createdAt: Date.now() - 600000,
  },
  {
    id: '3',
    name: '지난주 번개',
    hostId: '1',
    inviteCode: 'GHI789',
    status: 'finished',
    participants: [
      { user: { id: '1', nickname: '나' }, drunkLevel: 3, drinkCount: 5, baselineCompleted: true, levelHistory: [] },
      { user: { id: '5', nickname: '친구3' }, drunkLevel: 2, drinkCount: 4, baselineCompleted: true, levelHistory: [] },
    ],
    createdAt: Date.now() - 86400000 * 7,
    startedAt: Date.now() - 86400000 * 7,
    finishedAt: Date.now() - 86400000 * 7 + 14400000,
  },
]

/** 탭 인덱스에 따라 세션 목록을 필터링 (0=전체, 1=대기중, 2=진행중) */
function filterSessions(sessions: Session[], tabIndex: number): Session[] {
  switch (tabIndex) {
    case 1: return sessions.filter((s) => s.status === 'waiting')
    case 2: return sessions.filter((s) => s.status === 'active')
    default: return sessions
  }
}

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [inviteCode, setInviteCode] = useState('')
  const filteredSessions = filterSessions(mockSessions, activeTab)
  const currentMonth = new Date().getMonth() + 1
  const monthlyCount = mockSessions.filter((s) => {
    const d = new Date(s.createdAt)
    return d.getMonth() + 1 === currentMonth
  }).length

  return (
    <PageTransition>
      <Header
        variant="home"
        title="핑이"
        right={
          <button
            onClick={() => navigate('/mypage')}
            className="w-9 h-9 rounded-full bg-pingi-50 flex items-center justify-center text-[13px] font-bold text-pingi-600"
          >
            {user?.nickname.charAt(0)}
          </button>
        }
      />

      <div className="flex flex-col gap-3 pb-6">
        <AlertBanner />

        <SectionTabs tabs={TABS} activeIndex={activeTab} onChange={setActiveTab} />

        <SessionListCard sessions={filteredSessions} />

        <div className="mx-5 flex gap-3 items-center">
          <input
            placeholder="초대 코드 입력"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="flex-1 min-w-0 h-[52px] px-5 rounded-2xl border-none bg-white text-grey-900 text-[15px] placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-pingi-500/20 transition-all"
          />
          <button
            onClick={() => {
              if (inviteCode.trim()) navigate(`/session/join?code=${inviteCode.trim()}`)
            }}
            disabled={!inviteCode.trim()}
            className="shrink-0 h-[52px] w-[76px] rounded-2xl bg-pingi-50 text-pingi-600 text-[14px] font-semibold active:bg-pingi-100 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            참가
          </button>
        </div>

        <StatsSummaryCard totalSessions={monthlyCount} month={currentMonth} />

        <ProfileCard
          nickname={user?.nickname ?? ''}
          avgLevel={2}
          totalCount={mockSessions.length}
        />
      </div>
    </PageTransition>
  )
}
