/**
 * @file Card.tsx - 카드 컨테이너 컴포넌트
 *
 * 흰색 배경에 둥근 모서리를 가진 범용 카드 레이아웃.
 * 목록 아이템, 정보 표시, 통계 등 다양한 곳에서 컨텐츠를 감싸는 용도로 사용된다.
 *
 * @param padding - 내부 여백 크기: 'sm' | 'md' | 'lg'
 */
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  sm: 'px-4 py-3.5',
  md: 'px-5 py-4.5',
  lg: 'px-6 py-5',
}

export default function Card({ children, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
