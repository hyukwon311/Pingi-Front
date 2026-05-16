/**
 * @file SectionTabs.tsx - 섹션 탭 전환 컴포넌트
 *
 * 홈 화면에서 "전체 / 대기중 / 진행중" 등의 탭을 표시하고,
 * 활성 탭에 하단 인디케이터(밑줄)를 보여준다.
 *
 * @param tabs - 탭 라벨 배열 (예: ['전체', '대기중', '진행중'])
 * @param activeIndex - 현재 활성 탭 인덱스
 * @param onChange - 탭 변경 시 호출되는 콜백
 */
interface SectionTabsProps {
  tabs: string[]
  activeIndex: number
  onChange: (index: number) => void
}

export default function SectionTabs({ tabs, activeIndex, onChange }: SectionTabsProps) {
  return (
    <div className="mx-5 flex items-center gap-1 border-b border-grey-200">
      {tabs.map((tab, i) => {
        const isActive = i === activeIndex
        return (
          <button
            key={tab}
            onClick={() => onChange(i)}
            className={`relative px-4 py-3 text-[14px] font-semibold transition-colors ${
              isActive ? 'text-grey-900' : 'text-grey-400'
            }`}
          >
            {tab}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] h-[2px] bg-grey-900 rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
