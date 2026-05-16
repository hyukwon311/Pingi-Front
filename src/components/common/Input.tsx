/**
 * @file Input.tsx - 텍스트 입력 컴포넌트
 *
 * 라벨과 에러 메시지를 포함한 스타일링된 입력 필드.
 * 닉네임 입력, 초대 코드 입력 등에 사용된다.
 *
 * @param label - 입력 필드 위에 표시할 라벨 텍스트
 * @param error - 유효성 검사 실패 시 표시할 에러 메시지
 */
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.replace(/\s/g, '-').toLowerCase()
  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <label htmlFor={inputId} className="text-[15px] font-semibold text-grey-900 pl-0.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3.5 rounded-2xl border-none bg-white text-grey-900 text-[16px]
          placeholder:text-grey-400
          focus:outline-none focus:ring-2 focus:ring-pingi-500/20
          transition-all
          ${error ? 'ring-2 ring-status-danger/30' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-status-danger pl-0.5">{error}</p>}
    </div>
  )
}
