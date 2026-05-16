/**
 * @file VoiceWaveform.tsx - 음성 파형 시각화 컴포넌트
 *
 * 녹음 중일 때 12개의 바(bar)가 랜덤 높이로 움직이며 음성 입력을 시각적으로 표현한다.
 * 120ms마다 바 높이가 갱신되어 파형 애니메이션 효과를 만든다.
 * 비활성 상태에서는 모든 바가 동일한 낮은 높이로 고정된다.
 *
 * @param isActive - 파형 애니메이션 활성화 여부 (녹음 중이면 true)
 */
import { useEffect, useState } from 'react'

interface VoiceWaveformProps {
  isActive: boolean
}

export default function VoiceWaveform({ isActive }: VoiceWaveformProps) {
  const [bars, setBars] = useState<number[]>(Array(12).fill(0.3))

  useEffect(() => {
    if (!isActive) {
      setBars(Array(12).fill(0.3))
      return
    }
    const id = setInterval(() => {
      setBars(Array(12).fill(0).map(() => 0.2 + Math.random() * 0.8))
    }, 120)
    return () => clearInterval(id)
  }, [isActive])

  return (
    <div className="relative flex items-center justify-center">
      <div className="w-28 h-28 rounded-full border-[5px] border-white/80 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/30 flex items-end justify-center gap-[3px] p-3">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-white transition-all duration-100"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
