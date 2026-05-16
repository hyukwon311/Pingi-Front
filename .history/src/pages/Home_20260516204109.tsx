import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import PageTransition from '@/components/layout/PageTransition'
import SessionListCard from '@/components/home/SessionListCard'
import SectionTabs from '@/components/home/SectionTabs'
import StatsSummaryCard from '@/components/home/StatsSummaryCard'
import ProfileCard from '@/components/home/ProfileCard'
import type { Session } from '@/types/session'

const TABS = ['전체', '대기중', '진행중']

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
    case 1: return sessions.filter((s) => s.status === 'waiting')
    case 2: return sessions.filter((s) => s.status === 'active' || s.status === 'baseline')
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

  const handleJoin = () => {
    if (inviteCode.trim()) {
      navigate(`/session/join?code=${inviteCode.trim()}`)
    }
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-3 pb-6">
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
            onClick={handleJoin}
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
