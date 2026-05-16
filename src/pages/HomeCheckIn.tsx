/**
 * @file HomeCheckIn.tsx - 귀가 체크인 페이지
 *
 * 술자리 종료 후 각 멤버가 무사히 귀가했는지 확인하고 후기를 남기는 화면이다.
 * 상단에는 모든 멤버의 귀가 상태(귀가 중, 도착 완료)가 그리드로 표시되고,
 * 사용자는 자신의 귀가 상태를 업데이트하거나 "귀가 완료" 버튼으로 안전 귀가를 알릴 수 있다.
 * "후기 남기기" 섹션에서는 5초간 음성 후기를 녹음할 수 있으며,
 * 녹음된 후기는 TTS로 변환되어 텍스트와 함께 다른 멤버들에게 공유된다.
 * 모든 멤버가 귀가 완료하면 무사 귀가 화면으로 이동한다.
 */
import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import HomeStatusGrid from '@/components/home/HomeStatusGrid'
import VoiceWaveform from '@/components/voice/VoiceWaveform'
import RecStatus from '@/components/voice/RecStatus'
import PageTransition from '@/components/layout/PageTransition'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'
import type { CharacterBreed } from '@/types/room'

type HomeState = 'home' | 'moving' | 'pending'

interface MemberHomeStatus {
  nickname: string
  breed: CharacterBreed
  state: HomeState
  arrivedAt?: string
}

interface MemberReview {
  nickname: string
  breed: CharacterBreed
  text: string
  audioUrl?: string
}

export default function HomeCheckIn() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [myStatus, setMyStatus] = useState<HomeState>('pending')
  const [isRecordingReview, setIsRecordingReview] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } = useVoiceRecorder()

  // TODO: API/WebSocket에서 실시간 상태 받기
  const members: MemberHomeStatus[] = [
    { nickname: '민준', breed: 'retriever', state: 'home', arrivedAt: '23:12' },
    { nickname: '수진', breed: 'pomeranian', state: 'moving' },
    { nickname: '지훈', breed: 'shiba', state: 'home', arrivedAt: '23:08' },
    { nickname: '수아', breed: 'poodle', state: 'pending' },
  ]

  // TODO: API에서 친구들 후기 받기 (STT 변환된 텍스트 + 음성)
  const [reviews, setReviews] = useState<MemberReview[]>([
    { nickname: '민준', breed: 'retriever', text: '오늘 진짜 재밌었다~ 다음에 또 하자!', audioUrl: '' },
    { nickname: '지훈', breed: 'shiba', text: '막차 겨우 탔어 ㅋㅋㅋ 다들 잘 들어가~', audioUrl: '' },
  ])

  const handleStartReview = async () => {
    setIsRecordingReview(true)
    setRecordSeconds(0)
    await startRecording()
    
    // 녹음 시간 카운트
    const timer = setInterval(() => {
      setRecordSeconds((s) => s + 1)
    }, 1000)
    
    // 타이머 저장해서 나중에 정리
    ;(window as any).__reviewTimer = timer
  }

  const handleStopReview = () => {
    clearInterval((window as any).__reviewTimer)
    stopRecording()
    setIsRecordingReview(false)
    setMyStatus('home')
    
    // TODO: API로 음성 업로드 및 STT 변환
    // 임시로 내 후기 추가
    setReviews((prev) => [
      ...prev,
      { nickname: '나', breed: 'poodle', text: '(내 후기 - STT 변환 중...)', audioUrl: '' },
    ])
  }

  const handleStillMoving = () => {
    setMyStatus('moving')
  }

  const handlePlayAudio = (nickname: string, audioUrl: string) => {
    if (!audioUrl) {
      alert('음성 파일이 없습니다.')
      return
    }
    
    if (playingAudio === nickname) {
      audioRef.current?.pause()
      setPlayingAudio(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setPlayingAudio(nickname)
      }
    }
  }

  const allHome = members.every((m) => m.state === 'home')

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col overflow-y-auto">
        <div className="text-center">
          <h1 className="font-display text-2xl text-brown-900">
            🏠 집 잘 들어갔어요?
          </h1>
          <p className="text-sm text-brown-500 mt-2">
            술자리 끝난 지 30분 지났어요.
          </p>
        </div>

        <Card className="mt-6">
          <HomeStatusGrid members={members} />
        </Card>

        {/* 녹음 중 UI */}
        {isRecordingReview && (
          <Card className="mt-4 text-center">
            <p className="text-sm text-brown-900 mb-3">오늘 술자리 한마디!</p>
            <VoiceWaveform active={isRecording} />
            <RecStatus seconds={recordSeconds + 1} total={10} />
            <p className="text-xs text-brown-400 mt-2">
              다 말했으면 녹음 종료를 눌러주세요
            </p>
          </Card>
        )}

        {/* 친구들 후기 목록 */}
        {reviews.length > 0 && !isRecordingReview && (
          <div className="mt-4">
            <p className="text-sm font-bold text-brown-900 mb-2">🗣️ 친구들 후기</p>
            <div className="flex flex-col gap-2">
              {reviews.map((review) => (
                <Card key={review.nickname} padding="sm">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-12 flex justify-center">
                      <Character breed={review.breed} level={0} size="sm" showBadge={false} showEffects={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm text-brown-900">{review.nickname}</p>
                      <p className="text-sm text-brown-600 mt-1 break-words leading-relaxed">
                        "{review.text}"
                      </p>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(review.nickname, review.audioUrl || '')}
                      className="shrink-0 w-10 h-10 rounded-full bg-highlight/30 flex items-center justify-center text-lg"
                    >
                      {playingAudio === review.nickname ? '⏸' : '▶️'}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6 flex flex-col gap-3">
          {isRecordingReview ? (
            <Button variant="secondary" onClick={handleStopReview}>
              ⏹ 녹음 종료
            </Button>
          ) : myStatus === 'home' ? (
            <div className="text-center py-3 bg-success/10 rounded-xl">
              <p className="font-display text-success">✓ 후기 등록 완료!</p>
            </div>
          ) : (
            <Button onClick={handleStartReview}>
              🎙️ 후기 남기기 (녹음)
            </Button>
          )}
          
          {!isRecordingReview && myStatus !== 'home' && (
            <Button variant="secondary" onClick={handleStillMoving}>
              🚖 아직 이동 중
            </Button>
          )}
          
          {allHome && !isRecordingReview && (
            <Button variant="ghost" onClick={() => navigate(`/r/${code}/done`)}>
              모두 귀가 완료 확인
            </Button>
          )}
        </div>

        {/* 숨겨진 오디오 플레이어 */}
        <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} />
      </div>
    </PageTransition>
  )
}
