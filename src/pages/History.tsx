/**
 * @file History.tsx - 술자리 기록 페이지
 *
 * 과거에 참여했던 술자리 세션들을 시간순으로 보여주는 화면.
 * 각 세션의 이름, 날짜, 참가 인원, 소요 시간, 본인 취도를 표시한다.
 * 세션 카드 클릭 시 해당 세션의 결과 페이지로 이동한다.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import PageTransition from '@/components/layout/PageTransition'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import MonthPicker from '@/components/common/MonthPicker'
import type { Session } from '@/types/session'

/** TODO: API 연동 후 제거할 더미 기록 데이터 */
const mockHistory: Session[] = [
  {
    id: '10',
    name: '금요 회식',
    hostId: '1',
    inviteCode: 'A1',
    status: 'finished',
    participants: [
      { user: { id: '1', nickname: '나' }, drunkLevel: 3, drinkCount: 5, isReady: true, levelHistory: [] },
      { user: { id: '2', nickname: '친구1' }, drunkLevel: 2, drinkCount: 3, isReady: true, levelHistory: [] },
    ],
    createdAt: Date.now() - 86400000 * 2,
    startedAt: Date.now() - 86400000 * 2,
    finishedAt: Date.now() - 86400000 * 2 + 14400000,
  },
  {
    id: '11',
    name: '대학 동기 모임',
    hostId: '2',
    inviteCode: 'B2',
    status: 'finished',
    participants: [
      { user: { id: '1', nickname: '나' }, drunkLevel: 2, drinkCount: 4, isReady: true, levelHistory: [] },
      { user: { id: '3', nickname: '동기1' }, drunkLevel: 4, drinkCount: 7, isReady: true, levelHistory: [] },
      { user: { id: '4', nickname: '동기2' }, drunkLevel: 1, drinkCount: 2, isReady: true, levelHistory: [] },
    ],
    createdAt: Date.now() - 86400000 * 7,
    startedAt: Date.now() - 86400000 * 7,
    finishedAt: Date.now() - 86400000 * 7 + 10800000,
  },
  {
    id: '12',
    name: '팀 회식',
    hostId: '1',
    inviteCode: 'C3',
    status: 'finished',
    participants: [
      { user: { id: '1', nickname: '나' }, drunkLevel: 1, drinkCount: 1, isReady: true, levelHistory: [] },
      { user: { id: '5', nickname: '팀장' }, drunkLevel: 3, drinkCount: 6, isReady: true, levelHistory: [] },
    ],
    createdAt: Date.now() - 86400000 * 14,
    startedAt: Date.now() - 86400000 * 14,
    finishedAt: Date.now() - 86400000 * 14 + 7200000,
  },
]

/** timestamp를 "M월 D일" 형태로 변환 */
function formatDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

/** 시작~종료 시각의 차이를 "N시간" 형태로 변환 */
function formatDuration(start: number, end: number): string {
  const hours = Math.round((end - start) / 3600000)
  return `${hours}시간`
}

/** 취도 레벨별 배지 라벨 및 색상 variant 매핑 */
const levelBadge: Record<number, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  1: { label: 'Lv.1 멀쩡', variant: 'success' },
  2: { label: 'Lv.2 기분좋음', variant: 'success' },
  3: { label: 'Lv.3 알딸딸', variant: 'warning' },
  4: { label: 'Lv.4 취함', variant: 'danger' },
  5: { label: 'Lv.5 만취', variant: 'danger' },
}

export default function History() {
  const navigate = useNavigate()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const filtered = mockHistory.filter((s) => {
    const d = new Date(s.createdAt)
    return d.getFullYear() === year && d.getMonth() + 1 === month
  })

  return (
    <PageTransition>
      <Header variant="home" title="기록" />
      <div className="flex flex-col gap-3 px-5 pb-6">
        <MonthPicker year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m) }} />

        <p className="text-[13px] text-grey-500">
          {year}년 {month}월 · {filtered.length}회 참여
        </p>

        {filtered.map((session) => {
          const myParticipant = session.participants.find((p) => p.user.id === '1')
          const badge = levelBadge[myParticipant?.drunkLevel ?? 1]
          return (
            <Card
              key={session.id}
              className="cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/session/${session.id}/result`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-grey-900">{session.name}</p>
                  <p className="text-[13px] text-grey-500 mt-1">
                    {formatDate(session.createdAt)} · {session.participants.length}명 · {session.finishedAt ? formatDuration(session.startedAt!, session.finishedAt) : ''}
                  </p>
                </div>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <Card className="text-center py-16">
            <p className="text-[14px] text-grey-400">{month}월에는 기록이 없어요</p>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
