/**
 * @file InstagramCard.tsx - 인스타 공유 카드 페이지
 *
 * 술자리 결과를 이미지로 만들어 SNS에 공유할 수 있는 카드 생성 화면이다.
 */
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import LevelBadge from '@/components/common/LevelBadge'
import Character from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'
import { getRoom, getFinalReport } from '@/services/api'

type CardRatio = 'story' | 'feed'

interface MemberResult {
  nickname: string
  level: number
  breed: CharacterBreed
}

export default function InstagramCard() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [ratio, setRatio] = useState<CardRatio>('story')
  const [isDownloading, setIsDownloading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionInfo, setSessionInfo] = useState({ date: '', place: '', winner: '' })
  const [members, setMembers] = useState<MemberResult[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!code) return
      try {
        const [room, report] = await Promise.all([
          getRoom(code),
          getFinalReport(code).catch(() => null),
        ])

        // 날짜 포맷
        const date = new Date(room.scheduledAt)
        const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`

        // 멤버 레벨 정렬 (높은 순)
        const sortedMembers = [...room.members].sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
        const winner = sortedMembers[0]?.nickname || ''

        setSessionInfo({
          date: dateStr,
          place: room.location,
          winner,
        })

        setMembers(room.members.map(m => ({
          nickname: m.nickname,
          level: m.level ?? 0,
          breed: (m.breed || 'retriever') as CharacterBreed,
        })))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [code])

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#fdf8ec',
        scale: 2,
        useCORS: true,
      })

      const link = document.createElement('a')
      link.download = `pingi-${sessionInfo.date.replace(/\./g, '')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('다운로드 실패:', error)
      alert('다운로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsDownloading(false)
    }
  }

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
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-xl text-brown-900">
            미리보기
          </h1>
        </div>

        {/* 카드 미리보기 */}
        <div className="flex justify-center mt-4">
          <div
            ref={cardRef}
            className={`
              bg-paper border-2 border-brown-300 rounded-2xl p-4 shadow-card
              ${ratio === 'story' ? 'w-48 aspect-[9/16]' : 'w-64 aspect-square'}
              flex flex-col justify-between
            `}
          >
            <div className="text-center">
              <p className="font-display text-sm text-ink">🌀 핑이 술자리 결과</p>
              <div className="border-t border-dashed border-brown-300 my-2" />
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              {members.map((m) => (
                <div key={m.nickname} className="text-center">
                  <Character breed={m.breed} level={m.level} size="xs" />
                  <p className="text-[9px] font-display text-brown-900 mt-1">
                    {m.nickname}
                  </p>
                  <div className="flex justify-center mt-0.5">
                    <LevelBadge level={m.level} size="sm" />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="border-t border-dashed border-brown-300 my-2" />
              <p className="text-[9px] text-brown-900">
                🏆 오늘의 술짱: {sessionInfo.winner}
              </p>
              <p className="text-[8px] text-brown-400 mt-0.5">
                📅 {sessionInfo.date} {sessionInfo.place}
              </p>
              <p className="text-[8px] text-brown-400 mt-1">
                #핑이 #술자리음주로그
              </p>
            </div>
          </div>
        </div>

        {/* 비율 선택 */}
        <Card className="mt-6">
          <p className="text-xs font-semibold text-brown-500 mb-2">카드 비율</p>
          <div className="flex gap-2">
            <button
              onClick={() => setRatio('story')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                ratio === 'story'
                  ? 'bg-ink text-white'
                  : 'bg-white border-2 border-brown-300 text-brown-500'
              }`}
            >
              스토리 9:16
            </button>
            <button
              onClick={() => setRatio('feed')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                ratio === 'feed'
                  ? 'bg-ink text-white'
                  : 'bg-white border-2 border-brown-300 text-brown-500'
              }`}
            >
              피드 1:1
            </button>
          </div>
        </Card>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? '다운로드 중...' : '📥 PNG 다운로드'}
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/r/${code}/home`)}>
            🏠 귀가 체크인 켜기
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
