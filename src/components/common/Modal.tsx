/**
 * @file Modal.tsx - 모달 컴포넌트
 *
 * 화면 중앙에 나타나는 모달. ink 보더 + paper 배경.
 * 핑이타임 알림, 녹음 등에 사용.
 *
 * @param open - 모달 표시 여부
 * @param onClose - 모달 닫기 콜백 (선택, 없으면 배경 클릭으로 닫지 않음)
 */
import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
}

export default function Modal({ open, onClose, children, className = '' }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-brown-900/85 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-paper rounded-3xl p-6 w-[88%] max-w-sm border-3 border-ink text-center animate-fade-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
