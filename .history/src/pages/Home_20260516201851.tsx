import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import PageTransition from '@/components/layout/PageTransition'
import AlertBanner from '@/components/home/AlertBanner'
import SessionListCard from '@/components/home/SessionListCard'
import SectionTabs from '@/components/home/SectionTabs'
import StatsSummaryCard from '@/components/home/StatsSummaryCard'
import ProfileCard from '@/components/home/ProfileCard'
import type { Session } from '@/types/session'

const TABS = ['진행중', '대기중', '전체']

const mockSessions: Session[] = [
  {
    id: '1',
    name: '금요 회식',
    hostId: '1',
    inviteCode: 'ABC123',
    status: 'active',
    participants: [
      { user: { id: '1', nickname: '나' }, drunkLevel: 1, drinkCount: 2, isReady: true, levelHistory: [] },
      { user: { id: '2', nickname: '친구1' }, drunkLevel: 2, drinkCount: 3, isReady: true, levelHistory: [] },
      { user: { id: '3', nickname: '친구2' }, drunkLevel: 1, drinkCount: 1, isReady: true, levelHistory: [] },
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
      { user: { id: '1', nickname: '나' }, drunkLevel: 0, drinkCount: 0, isReady: false, levelHistory: [] },
      { user: { id: '4', nickname: '동기1' }, drunkLevel: 0, drinkCount: 0, isReady: true, levelHistory: [] },
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
      { user: { id: '1', nickname: '나' }, drunkLevel: 3, drinkCount: 5, isReady: true, levelHistory: [] },
      { user: { id: '5', nickname: '친구3' }, drunkLevel: 2, drinkCount: 4, isReady: true, levelHistory: [] },
    ],
    createdAt: Date.now() - 86400000 * 7,
    startedAt: Date.now() - 86400000 * 7,
    finishedAt: Date.now() - 86400000 * 7 + 14400000,
  },
]

function filterSessions(sessions: Session[], tabIndex: number): Session[] {
  switch (tabIndex) {
    case 0: return sessions.filter((s) => s.status === 'active' || s.status === 'baseline')
    case 1: return sessions.filter((s) => s.status === 'waiting')
    case 2: return sessions.filter((s) => s.status === 'finished')
    default: return sessions
  }
}

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(3)
  const [inviteCode, setInviteCode] = useState('')

  const activeSession = mockSessions.find((s) => s.status === 'active')
  const filteredSessions = filterSessions(mockSessions, activeTab)
  const currentMonth = new Date().getMonth() + 1
  const monthlyCount = mockSessions.filter((s) => {
    const d = new Date(s.createdAt)
    return d.getMonth() + 1 === currentMonth
  }).length

  const handleJoin = () => {
    if (inviteCode.trim()) {
      navigate(`/session/join?code=${inviteCode.trim()}`)
    }
  }

  return (
    <PageTransition>
      <Header
        variant="home"
        title="핑이"
        right={
          <>
            <button className="w-9 h-9 flex items-center justify-center rounded-full active:bg-grey-200 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/mypage')}
              className="w-9 h-9 rounded-full bg-pingi-50 flex items-center justify-center text-[13px] font-bold text-pingi-600"
            >
              {user?.nickname.charAt(0)}
            </button>
          </>
        }
      />

      <div className="flex flex-col gap-3 pb-6">
        <AlertBanner
          sessionId={activeSession?.id}
          sessionName={activeSession?.name}
        />

        <div className="mx-5 flex gap-3 items-center">
          <input
            placeholder="초대 코드 입력"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="flex-1 min-w-0 h-[48px] px-4 rounded-2xl border-none bg-white text-grey-900 text-[15px] placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-pingi-500/20 transition-all"
          />
          <button
            onClick={handleJoin}
            disabled={!inviteCode.trim()}
            className="shrink-0 h-[48px] w-[72px] rounded-2xl bg-pingi-50 text-pingi-600 text-[14px] font-semibold active:bg-pingi-100 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            참가
          </button>
        </div>

        <SectionTabs tabs={TABS} activeIndex={activeTab} onChange={setActiveTab} />

        <SessionListCard sessions={filteredSessions} />

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
