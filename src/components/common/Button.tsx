/**
 * @file Button.tsx - 범용 버튼 컴포넌트
 *
 * 앱 전체에서 사용되는 통일된 스타일의 버튼.
 * variant(색상 테마)와 size(크기)를 조합하여 다양한 용도로 사용한다.
 *
 * @param variant - 'primary' (메인) | 'secondary' (보조) | 'ghost' (투명) | 'danger' (위험)
 * @param size - 'sm' | 'md' | 'lg'
 * @param fullWidth - true이면 부모 너비를 가득 채움
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
}

/** variant별 색상 스타일 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-pingi-500 text-white active:bg-pingi-600',
  secondary: 'bg-pingi-50 text-pingi-600 active:bg-pingi-100',
  ghost: 'bg-transparent text-grey-600 active:bg-grey-100',
  danger: 'bg-grey-100 text-status-danger active:bg-grey-200',
}

/** size별 패딩·폰트·둥글기 스타일 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px] rounded-xl min-h-[36px]',
  md: 'px-5 py-3 text-[15px] rounded-2xl min-h-[48px]',
  lg: 'px-6 py-4 text-[16px] rounded-2xl min-h-[54px]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold transition-all duration-150
        ${variantStyles[variant]}
        ${sizeStyles[size]}
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
