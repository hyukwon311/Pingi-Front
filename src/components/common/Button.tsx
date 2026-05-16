/**
 * @file Button.tsx - 범용 버튼 컴포넌트
 *
 * 핑이 디자인 시스템의 표준 버튼 컴포넌트로, 모든 CTA와 액션에 사용된다.
 * 4가지 variant를 제공하며, 각각의 스타일은 다음과 같다:
 * - primary: 빨간색(ink) 배경의 메인 CTA 버튼
 * - secondary: 흰색 배경에 갈색 테두리의 보조 버튼
 * - ghost: 투명 배경에 점선 테두리의 tertiary 버튼
 * - success: 녹색 배경의 긍정적 액션 버튼 (도착 완료 등)
 * fullWidth prop으로 버튼 너비를 제어할 수 있으며, 기본적으로 부모 너비를 가득 채운다.
 * 모든 표준 HTML button 속성을 지원한다.
 *
 * @param variant - 버튼 스타일 종류
 * @param fullWidth - true이면 부모 너비를 가득 채움 (기본: true)
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-white font-display text-base active:opacity-90',
  secondary:
    'bg-white text-brown-900 border-2 border-brown-300 font-display text-base active:bg-gray-50',
  ghost:
    'bg-transparent text-brown-500 border-[1.5px] border-dashed border-brown-300 font-display text-sm',
  success:
    'bg-success text-white font-display text-base active:opacity-90',
}

export default function Button({
  variant = 'primary',
  fullWidth = true,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        py-3.5 transition-all duration-150
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-30 pointer-events-none' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
