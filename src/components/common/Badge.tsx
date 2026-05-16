/**
 * @file Badge.tsx - 배지 컴포넌트
 *
 * 작은 원형 배지. 상태 표시나 라벨에 사용.
 * 기본: 흰색 배경 + brown-300 보더
 *
 * @param variant - 'default' | 'highlight' | 'success' | 'warning' | 'danger'
 */
import type { ReactNode, HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'highlight' | 'success' | 'warning' | 'danger'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white border-[1.5px] border-brown-300 text-brown-900',
  highlight: 'bg-highlight border-[1.5px] border-highlight text-brown-900 font-bold',
  success: 'bg-success/10 border-[1.5px] border-success text-success',
  warning: 'bg-warning/10 border-[1.5px] border-warning text-warning',
  danger: 'bg-danger/10 border-[1.5px] border-danger text-danger',
}

export default function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-2 py-0.5 text-[10px]
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}
