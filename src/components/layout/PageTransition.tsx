/**
 * @file PageTransition.tsx - 페이지 전환 애니메이션 래퍼
 *
 * 페이지가 마운트될 때 fade-in 애니메이션을 적용하는 래퍼 컴포넌트.
 * 각 페이지의 최상위를 이 컴포넌트로 감싸면 부드러운 전환 효과가 적용된다.
 */
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return <div className="animate-fade-in">{children}</div>
}
