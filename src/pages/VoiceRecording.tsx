/**
 * @file VoiceRecording.tsx - 발음 테스트 녹음 페이지
 *
 * 술자리 진행 중 30분마다 발음 테스트를 수행하는 전체 화면 녹음 UI.
 * 보라색 그라데이션 배경에 음성 파형 시각화와 녹음 버튼이 표시된다.
 * 녹음 완료 또는 X 버튼 클릭 시 세션 대시보드로 돌아간다.
 */
import { useNavigate, useParams } from 'react-router-dom'
import VoiceWaveform from '@/components/voice/VoiceWaveform'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'
import { BASELINE_SENTENCES } from '@/constants/sentences'

export default function VoiceRecording() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder()

  const sentence = BASELINE_SENTENCES[0]

  const handleStop = () => {
    stopRecording()
    navigate(`/session/${id}`)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gradient-to-b from-pingi-500 to-pingi-600">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
        <VoiceWaveform isActive={isRecording} />
        <p className="text-white text-[18px] font-medium">
          {isRecording ? '듣고 있어요' : '준비되셨나요?'}
        </p>
        <p className="text-white/70 text-[14px] text-center leading-relaxed">
          "{sentence}"
        </p>
      </div>

      <div className="flex items-center justify-between px-8 pb-10">
        <button
          onClick={isRecording ? handleStop : startRecording}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:bg-white/30 transition-colors"
        >
          {isRecording ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <rect x="3" y="2" width="5" height="16" rx="1" />
              <rect x="12" y="2" width="5" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4Z" fill="currentColor" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4m-3 0h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <button
          onClick={() => navigate(`/session/${id}`)}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:bg-white/30 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
