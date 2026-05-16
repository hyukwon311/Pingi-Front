/**
 * @file ReviewPrompt.tsx - 술자리 후기 녹음 안내
 *
 * 귀가 체크인 화면에서 5초 음성 후기 녹음 안내.
 * 예시 문구를 랜덤으로 보여줌.
 */

const examples = [
  '오늘 진짜 미쳤다 ㅋㅋ',
  '다음엔 소주 안 마심',
  '민준이 꽐라 실화냐',
  '배고프다 라면 먹어야지',
  '오늘 술자리 최고',
  '다음엔 덜 마셔야지',
]

interface ReviewPromptProps {
  exampleCount?: number
}

export default function ReviewPrompt({ exampleCount = 2 }: ReviewPromptProps) {
  const shuffled = [...examples].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, exampleCount)

  return (
    <div className="text-center">
      <div className="font-display text-sm text-ink">
        오늘 술자리 한 마디 남기고 가!
      </div>
      <div className="text-[11px] text-brown-500 mt-1">
        취한 목소리로 남기는 진짜 음주 로그 🎙
      </div>
      <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
        {selected.map((ex) => (
          <span
            key={ex}
            className="bg-ink/5 border border-ink/15 rounded-full px-2 py-0.5 text-[9px] text-brown-500"
          >
            "{ex}"
          </span>
        ))}
      </div>
    </div>
  )
}
