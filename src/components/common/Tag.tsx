/**
 * @file Tag.tsx - 태그 컴포넌트
 *
 * highlight 색상의 pill 형태 태그.
 * 뱃지, 라벨, 상태 표시에 사용.
 */
import type { HTMLAttributes } from 'react'

export default function Tag({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-block bg-highlight px-2.5 py-0.5 text-[11px] font-bold rounded-full ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
