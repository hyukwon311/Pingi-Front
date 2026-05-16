/**
 * @file Input.tsx - 텍스트 입력 컴포넌트
 *
 * brown 테마의 입력 필드. 라벨과 에러 메시지 지원.
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
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-brown-500 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3.5 py-2.5 bg-white border-[1.5px] border-brown-300 rounded-[10px]
          text-sm text-brown-900 placeholder:text-brown-400
          focus:outline-none focus:border-ink transition-colors
          ${error ? 'border-danger' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-1 pl-0.5">{error}</p>}
    </div>
  )
}
