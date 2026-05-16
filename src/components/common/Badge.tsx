/**
 * @file Badge.tsx - 상태 표시용 배지 컴포넌트
 *
 * 세션 상태(진행중, 대기중 등)나 준비 상태 등을 시각적으로 나타내는 작은 라벨.
 * variant로 색상 테마를 지정한다.
 *
 * @param variant - 'default' | 'success' | 'warning' | 'danger' | 'info'
 * @param children - 배지에 표시할 텍스트
 */
import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

/** variant별 배경색 + 텍스트색 매핑 */
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-grey-100 text-grey-500',
  success: 'bg-[#E8F5E9] text-status-success',
  warning: 'bg-[#FFF3E0] text-status-warning',
  danger: 'bg-[#FFEEF0] text-status-danger',
  info: 'bg-pingi-50 text-pingi-600',
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
