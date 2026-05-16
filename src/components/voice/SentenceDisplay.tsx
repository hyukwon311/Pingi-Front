/**
 * @file SentenceDisplay.tsx - 읽을 문장 표시 컴포넌트
 *
 * 발음 테스트에서 사용자가 읽어야 할 문장을 화면 중앙에 표시한다.
 * 상단의 진행 바(도트)로 현재 몇 번째 문장인지 시각적으로 보여준다.
 *
 * @param sentence - 현재 읽어야 할 문장 텍스트
 * @param currentIndex - 현재 문장 인덱스 (0부터 시작)
 * @param totalCount - 전체 문장 개수
 */
interface SentenceDisplayProps {
  sentence: string
  currentIndex: number
  totalCount: number
}

export default function SentenceDisplay({ sentence, currentIndex, totalCount }: SentenceDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-8">
      <div className="flex gap-1.5">
        {Array.from({ length: totalCount }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all ${
              i <= currentIndex ? 'w-6 bg-pingi-500' : 'w-3 bg-grey-200'
            }`}
          />
        ))}
      </div>
      <p className="text-center text-[17px] font-medium text-grey-900 leading-relaxed">
        "{sentence}"
      </p>
    </div>
  )
}
