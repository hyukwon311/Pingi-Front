/**
 * @file Card.tsx - 카드 컨테이너 컴포넌트
 *
 * 정보를 시각적으로 그룹화하는 흰색 배경의 카드 컨테이너다.
 * 둥근 모서리(rounded-2xl)와 그림자(shadow-card)를 기본으로 제공하며,
 * highlight prop을 true로 설정하면 노란색(highlight) 테두리가 추가되어 중요한 정보를 강조할 수 있다.
 * padding prop으로 내부 여백을 조절할 수 있으며(sm, md, lg),
 * 방 정보, 결과 카드, 멤버 상태 등 다양한 UI 요소를 감싸는데 사용된다.
 *
 * @param highlight - true면 노란색 테두리 추가
 * @param padding - 내부 여백 크기 ('sm' | 'md' | 'lg', 기본: 'md')
 */
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  highlight?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  sm: 'p-2.5',
  md: 'p-3.5',
  lg: 'p-5',
}

export default function Card({
  children,
  highlight = false,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-card
        ${paddingStyles[padding]}
        ${highlight ? 'border-2 border-highlight' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
