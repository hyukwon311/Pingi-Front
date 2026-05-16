/**
 * @file VoiceWaveform.tsx - 음성 파형 시각화 컴포넌트
 *
 * 녹음 중일 때 ink 색상의 바들이 wave-bar 애니메이션으로 움직인다.
 * 비활성 상태에서는 모든 바가 동일한 낮은 높이로 고정된다.
 *
 * @param active - 파형 애니메이션 활성화 여부 (녹음 중이면 true)
 * @param bars - 바 개수 (기본: 10)
 */

interface VoiceWaveformProps {
  active?: boolean
  bars?: number
}

export default function VoiceWaveform({ active = true, bars = 10 }: VoiceWaveformProps) {
  return (
    <div className="flex items-center justify-center gap-0.5 h-9">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-sm bg-ink ${active ? 'animate-wave-bar' : 'h-3'}`}
          style={active ? { animationDelay: `${i * 0.08}s` } : undefined}
        />
      ))}
    </div>
  )
}
