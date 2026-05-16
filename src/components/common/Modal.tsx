/**
 * @file Modal.tsx - 바텀 시트 모달 컴포넌트
 *
 * 화면 하단에서 슬라이드업으로 나타나는 바텀 시트 형태의 모달.
 * 열릴 때 배경 스크롤을 잠그고, 배경(딤) 클릭으로 닫을 수 있다.
 *
 * @param isOpen - 모달 표시 여부
 * @param onClose - 모달 닫기 콜백
 * @param title - 모달 상단 제목 (선택)
 */
import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  /** 모달이 열리면 body 스크롤을 방지하고, 닫히면 복원 */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-grey-900/40" onClick={onClose} />
      <div className="relative w-full max-w-[430px] bg-white rounded-t-[28px] px-6 pb-10 pt-5 animate-slide-up">
        <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-grey-200" />
        {title && <h3 className="mb-5 text-[18px] font-bold text-grey-900">{title}</h3>}
        {children}
      </div>
    </div>
  )
}
