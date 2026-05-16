/**
 * @file Home.tsx - 메인 홈 화면
 *
 * 핑이 앱의 첫 진입점으로, 사용자에게 두 가지 주요 액션을 제공한다:
 * 1. "새로운 술자리" 버튼 - 방장으로서 새 방을 생성 (/new로 이동)
 * 2. "참가하기" 버튼 - 초대 코드 입력 모달을 열어 기존 방에 참여
 * 로그인 없이 바로 사용 가능하며, 핑이 로고와 간단한 앱 설명을 포함한다.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'

export default function Home() {
  const navigate = useNavigate()
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [code, setCode] = useState('')

  const handleCodeSubmit = () => {
    if (code.trim().length >= 4) {
      navigate(`/r/${code.trim().toUpperCase()}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-5">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <img src="/logo.png" alt="핑이 로고" className="w-32 h-32 object-contain" />
        <h1 className="text-[32px] font-display text-brown-900 tracking-tight">
          핑이
        </h1>
        <p className="text-sm text-brown-500">술자리 음주 로그</p>
      </div>

      <div className="w-full max-w-sm mt-12 flex flex-col gap-3">
        <Button variant="primary" onClick={() => navigate('/new')}>
          방 만들기
        </Button>
        <Button variant="secondary" onClick={() => setShowCodeModal(true)}>
          코드 입력하기
        </Button>
      </div>

      <p className="text-xs text-brown-400 mt-6 text-center">
        이미 받은 링크가 있다면 그냥 누르세요
      </p>

      <Modal open={showCodeModal} onClose={() => setShowCodeModal(false)}>
        <h2 className="font-display text-lg text-brown-900 mb-4">
          방 코드 입력
        </h2>
        <Input
          placeholder="예: ABCDEF"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={8}
          className="text-center text-lg tracking-widest"
        />
        <div className="mt-4">
          <Button
            variant="primary"
            onClick={handleCodeSubmit}
            disabled={code.trim().length < 4}
          >
            입장하기
          </Button>
        </div>
      </Modal>
    </div>
  )
}
