/**
 * @file InstagramCard.tsx - 인스타 공유 카드 페이지
 *
 * 술자리 결과를 이미지로 만들어 SNS에 공유할 수 있는 카드 생성 화면이다.
 * 상단 토글로 스토리(9:16) 또는 피드(1:1) 비율을 선택할 수 있으며,
 * 카드에는 술자리 날짜, 장소, 참여 멤버의 캐릭터와 최종 레벨이 표시된다.
 * html2canvas 라이브러리를 사용하여 카드를 PNG 이미지로 다운로드하며,
 * 다운로드한 이미지를 인스타그램 스토리나 피드에 바로 업로드할 수 있다.
 */
import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import LevelBadge from '@/components/common/LevelBadge'
import Character from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'

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

  // TODO: API에서 결과 데이터 받기
  const sessionInfo = {
    date: '2026.05.16',
    place: '강남',
    winner: '민준',
  }

  const members: MemberResult[] = [
    { nickname: '민준', level: 5, breed: 'retriever' },
    { nickname: '수진', level: 4, breed: 'pomeranian' },
    { nickname: '지훈', level: 3, breed: 'shiba' },
    { nickname: '수아', level: 1, breed: 'poodle' },
  ]

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
