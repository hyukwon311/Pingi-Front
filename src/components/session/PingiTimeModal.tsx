/**
 * @file PingiTimeModal.tsx - 핑이타임 알림 모달
 *
 * 핑이타임 발동 시 5초 카운트다운 후 녹음 화면으로 전환.
 */
import { useState, useEffect } from 'react'
import Modal from '@/components/common/Modal'

interface PingiTimeModalProps {
  open: boolean
  onComplete: () => void
}

export default function PingiTimeModal({ open, onComplete }: PingiTimeModalProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!open) {
      setCountdown(5)
      return
    }

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          onComplete()
          return 0
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open, onComplete])

  return (
    <Modal open={open}>
      <div className="py-4">
        <div className="text-5xl mb-4">🌀</div>
        <h2 className="font-display text-2xl text-ink">
          핑이타임!
        </h2>
        <p className="text-sm text-brown-500 mt-2">
          5초 안에 시작합니다
        </p>
        <div className="font-display text-6xl text-ink mt-6 animate-pulse">
          {countdown}
        </div>
      </div>
    </Modal>
  )
}
