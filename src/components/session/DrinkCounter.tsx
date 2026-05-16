/**
 * @file DrinkCounter.tsx - 음주량 +/- 카운터 컴포넌트
 *
 * 마신 잔 수를 표시하고 +/- 버튼으로 증감하는 UI.
 * 0잔 이하로는 감소할 수 없다 (- 버튼 비활성화).
 * ParticipantCard 안에서 본인의 음주량을 조절할 때 사용된다.
 *
 * @param count - 현재 잔 수
 * @param onIncrement - + 버튼 클릭 콜백
 * @param onDecrement - - 버튼 클릭 콜백
 */
interface DrinkCounterProps {
  count: number
  onIncrement: () => void
  onDecrement: () => void
}

export default function DrinkCounter({ count, onIncrement, onDecrement }: DrinkCounterProps) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={onDecrement}
        disabled={count <= 0}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-grey-100 text-grey-600
          active:bg-grey-200 transition-colors disabled:opacity-25"
      >
        <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
          <path d="M1 1h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <span className="min-w-[3rem] text-center font-bold text-[17px] tabular-nums text-grey-900">
        {count}잔
      </span>
      <button
        onClick={onIncrement}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-pingi-50 text-pingi-600
          active:bg-pingi-100 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
