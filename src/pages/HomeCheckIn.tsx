/**
 * @file HomeCheckIn.tsx - 귀가 체크인 페이지
 *
 * 술자리 종료 후 각 멤버가 무사히 귀가했는지 확인하고 후기를 남기는 화면이다.
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import HomeStatusGrid from '@/components/home/HomeStatusGrid'
import VoiceWaveform from '@/components/voice/VoiceWaveform'
import RecStatus from '@/components/voice/RecStatus'
import PageTransition from '@/components/layout/PageTransition'
import { useVoiceRecorderWithSTT } from '@/hooks/useVoiceRecorderWithSTT'
import { useWebSocket } from '@/hooks/useWebSocket'
import type { CharacterBreed } from '@/types/room'
import { getRoom, checkInHome, getCurrentMemberId, updateMember } from '@/services/api'

type HomeState = 'home' | 'moving' | 'pending'

interface MemberHomeStatus {
  id: string
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
  const [members, setMembers] = useState<MemberHomeStatus[]>([])
  const [reviews, setReviews] = useState<MemberReview[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<number | null>(null)

  const { isRecording, transcript, interimTranscript, startRecording, stopRecording, resetRecording, getTranscriptSnapshot } = useVoiceRecorderWithSTT()

  // WebSocket 연결 - 귀가 상태 실시간 업데이트
  useWebSocket({
    roomCode: code || '',
    autoNavigate: false,
  })

  const fetchData = useCallback(async () => {
    if (!code) return
    try {
      const room = await getRoom(code)
      const currentId = getCurrentMemberId()
      const API_BASE = (import.meta.env.VITE_API_URL ?? '/v1').replace(/\/v1\/?$/, '')

      setMembers(room.members.map(m => {
        const hasHomeCheckin = !!(m as any).homeCheckinAt
        return {
          id: m.id,
          nickname: m.nickname,
          breed: (m.breed || 'retriever') as CharacterBreed,
          state: hasHomeCheckin ? 'home' : ((m as any).isMoving ? 'moving' : 'pending'),
          arrivedAt: hasHomeCheckin ? new Date((m as any).homeCheckinAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : undefined,
        }
      }))

      // 귀가 체크인한 멤버 후기 (텍스트 또는 음성 중 하나라도 있으면 표시)
      const homeMembers = room.members.filter(m => {
        const at = (m as any).homeCheckinAt
        const text = (m as any).homeCheckinTranscript
        const audio = (m as any).homeCheckinAudioUrl
        return !!(at && (text || audio))
      })
      setReviews(homeMembers.map(m => ({
        nickname: m.nickname,
        breed: (m.breed || 'retriever') as CharacterBreed,
        text: (m as any).homeCheckinTranscript || '',
        audioUrl: (m as any).homeCheckinAudioUrl
          ? `${API_BASE.replace(/\/$/, '')}/${String((m as any).homeCheckinAudioUrl).replace(/^\/+/, '')}`
          : undefined,
      })))

      // 내 상태 확인
      const me = room.members.find(m => m.id === currentId)
      if (me) {
        if ((me as any).homeCheckinAt) {
          setMyStatus('home')
        } else if ((me as any).isMoving) {
          setMyStatus('moving')
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    fetchData()
    // 5초마다 새로고침
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleStartReview = async () => {
    setIsRecordingReview(true)
    setRecordSeconds(0)
    await startRecording()

    timerRef.current = window.setInterval(() => {
      setRecordSeconds((s) => s + 1)
    }, 1000)
  }

  const handleStopReview = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsRecordingReview(false)
    setSubmitting(true)

    // 녹음 중지하고 blob이 준비될 때까지 대기 (종료 시점 STT 스냅샷은 훅 내부에서 처리)
    const recordedBlob = await stopRecording()
    const finalTranscript = getTranscriptSnapshot()

    // API로 귀가 체크인 전송 (오디오 + STT 텍스트)
    const memberId = getCurrentMemberId()
    if (memberId) {
      try {
        await checkInHome(memberId, recordedBlob || undefined, finalTranscript || undefined)
        setMyStatus('home')
        fetchData()
      } catch (error) {
        console.error('Failed to submit home checkin:', error)
      } finally {
        setSubmitting(false)
      }
    } else {
      setSubmitting(false)
    }
  }

  const handleStillMoving = async () => {
    const memberId = getCurrentMemberId()
    if (memberId) {
      try {
        // 이동 중 상태 업데이트 (서버에 알림)
        await updateMember(memberId, { isMoving: true } as any)
        setMyStatus('moving')
        fetchData()
      } catch (error) {
        console.error('Failed to update moving status:', error)
      }
    }
  }

  const handleHomeWithoutRecording = async () => {
    const memberId = getCurrentMemberId()
    if (memberId) {
      setSubmitting(true)
      try {
        await checkInHome(memberId)
        setMyStatus('home')
        fetchData()
      } catch (error) {
        console.error('Failed to submit home checkin:', error)
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handlePlayAudio = (nickname: string, audioUrl?: string) => {
    if (!audioUrl) {
      alert('음성 파일이 없습니다.')
      return
    }

    if (playingAudio === nickname) {
      audioRef.current?.pause()
      setPlayingAudio(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(audioUrl)
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    audio.onended = () => setPlayingAudio(null)
    audio.onerror = () => {
      console.error('Audio load error:', audio.error?.message, 'src:', audioUrl)
      setPlayingAudio(null)
      alert('음성 재생에 실패했어요. 파일이 없거나 형식을 지원하지 않아요.')
    }

    audio.load()
    audio.play().catch(err => {
      console.error('Audio play failed:', err)
      setPlayingAudio(null)
    })
    setPlayingAudio(nickname)
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

  const allHome = members.every((m) => m.state === 'home')

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col overflow-y-auto">
        <div className="text-center">
          <h1 className="font-display text-2xl text-brown-900">
            🏠 집 잘 들어갔어요?
          </h1>
          <p className="text-sm text-brown-500 mt-2">
            안전하게 귀가했다면 알려주세요!
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

            {/* 실시간 STT 표시 */}
            {(transcript || interimTranscript) && (
              <div className="mt-3 p-2 bg-brown-50 rounded-lg">
                <p className="text-sm text-brown-700">
                  {transcript}
                  <span className="text-brown-400">{interimTranscript}</span>
                </p>
              </div>
            )}

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
                    {review.audioUrl && (
                      <button
                        onClick={() => handlePlayAudio(review.nickname, review.audioUrl || '')}
                        className="shrink-0 w-10 h-10 rounded-full bg-highlight/30 flex items-center justify-center text-lg"
                      >
                        {playingAudio === review.nickname ? '⏸' : '▶️'}
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6 flex flex-col gap-3">
          {isRecordingReview ? (
            <Button variant="secondary" onClick={handleStopReview} disabled={submitting}>
              {submitting ? '저장 중...' : '⏹ 녹음 종료'}
            </Button>
          ) : myStatus === 'home' ? (
            <div className="text-center py-3 bg-success/10 rounded-xl">
              <p className="font-display text-success">✓ 귀가 완료!</p>
            </div>
          ) : (
            <>
              <Button onClick={handleStartReview}>
                🎙️ 후기 남기며 귀가 완료
              </Button>
              <Button variant="secondary" onClick={handleHomeWithoutRecording} disabled={submitting}>
                {submitting ? '저장 중...' : '✅ 그냥 귀가 완료'}
              </Button>
            </>
          )}

          {!isRecordingReview && myStatus === 'pending' && (
            <Button variant="ghost" onClick={handleStillMoving}>
              🚖 아직 이동 중
            </Button>
          )}

          {myStatus === 'moving' && !isRecordingReview && (
            <div className="text-center py-2">
              <p className="text-sm text-brown-500">🚖 이동 중으로 표시됨</p>
            </div>
          )}

          {allHome && !isRecordingReview && (
            <Button variant="ghost" onClick={() => navigate(`/r/${code}/done`)}>
              모두 귀가 완료 확인
            </Button>
          )}
        </div>

        {/* audioRef는 new Audio()로 관리 — DOM 요소 불필요 */}
      </div>
    </PageTransition>
  )
}
