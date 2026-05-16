/**
 * @file MonthPicker.tsx - 월 선택기 컴포넌트
 *
 * 좌우 화살표로 월을 이동하는 인라인 선택기와,
 * 월 텍스트를 클릭하면 12개월 그리드 팝업이 열리는 복합 컴포넌트.
 *
 * @param year - 현재 선택된 연도
 * @param month - 현재 선택된 월 (1~12)
 * @param onChange - (year, month) 선택 콜백
 * @param maxDate - 선택 가능한 최대 연/월 (기본: 현재 달)
 */
import { useEffect, useRef, useState } from 'react'

interface MonthPickerProps {
  year: number
  month: number
  onChange: (year: number, month: number) => void
  maxDate?: { year: number; month: number }
}

const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

export default function MonthPicker({ year, month, onChange, maxDate }: MonthPickerProps) {
  const now = new Date()
  const max = maxDate ?? { year: now.getFullYear(), month: now.getMonth() + 1 }

  const isFuture = (y: number, m: number) => y > max.year || (y === max.year && m > max.month)

  const [open, setOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(year)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setPickerYear(year)
  }, [open, year])

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const goPrev = () => {
    if (month === 1) onChange(year - 1, 12)
    else onChange(year, month - 1)
  }

  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  const isNextDisabled = isFuture(nextYear, nextMonth)

  const goNext = () => {
    if (isNextDisabled) return
    onChange(nextYear, nextMonth)
  }

  const selectMonth = (m: number) => {
    onChange(pickerYear, m)
    setOpen(false)
  }

  return (
    <div className="relative flex items-center justify-center gap-2">
      <button
        onClick={goPrev}
        className="w-8 h-8 flex items-center justify-center rounded-full text-grey-500 active:bg-grey-100 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 rounded-xl text-[15px] font-bold text-grey-900 active:bg-grey-100 transition-colors"
      >
        {year}년 {month}월
      </button>

      <button
        onClick={goNext}
        disabled={isNextDisabled}
        className="w-8 h-8 flex items-center justify-center rounded-full text-grey-500 active:bg-grey-100 transition-colors disabled:opacity-20 disabled:pointer-events-none"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="absolute top-full mt-2 z-40 w-[280px] bg-white rounded-2xl shadow-lg shadow-grey-900/10 border border-grey-100 p-4 animate-fade-in"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setPickerYear((y) => y - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-grey-500 active:bg-grey-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="text-[14px] font-bold text-grey-900">{pickerYear}년</span>
            <button
              onClick={() => setPickerYear((y) => y + 1)}
              disabled={pickerYear >= max.year}
              className="w-7 h-7 flex items-center justify-center rounded-full text-grey-500 active:bg-grey-100 transition-colors disabled:opacity-20 disabled:pointer-events-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {MONTH_LABELS.map((label, i) => {
              const m = i + 1
              const isSelected = pickerYear === year && m === month
              const disabled = isFuture(pickerYear, m)
              return (
                <button
                  key={m}
                  onClick={() => selectMonth(m)}
                  disabled={disabled}
                  className={`
                    py-2.5 rounded-xl text-[13px] font-semibold transition-all
                    ${isSelected
                      ? 'bg-pingi-500 text-white'
                      : disabled
                        ? 'text-grey-300 pointer-events-none'
                        : 'text-grey-700 active:bg-grey-100 hover:bg-grey-50'
                    }
                  `}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
