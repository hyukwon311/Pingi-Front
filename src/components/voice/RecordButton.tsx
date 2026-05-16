/**
 * @file RecordButton.tsx - 음성 녹음 버튼 컴포넌트
 *
 * 둥근 원형 버튼으로, 녹음 상태에 따라 외형이 달라진다:
 * - 녹음 전: 보라색 원 + 마이크 아이콘 (누르면 녹음 시작)
 * - 녹음 중: 흰색 원 + 빨간 정지 사각형 (누르면 녹음 정지)
 *
 * @param isRecording - 현재 녹음 중 여부
 * @param onStart - 녹음 시작 콜백
 * @param onStop - 녹음 정지 콜백
 */
interface RecordButtonProps {
  isRecording: boolean
  onStart: () => void
  onStop: () => void
}

export default function RecordButton({ isRecording, onStart, onStop }: RecordButtonProps) {
  return (
    <button
      onClick={isRecording ? onStop : onStart}
      className={`
        w-16 h-16 rounded-full flex items-center justify-center transition-all
        ${isRecording
          ? 'bg-white shadow-lg scale-110'
          : 'bg-pingi-500 active:bg-pingi-600 shadow-md'
        }
      `}
    >
      {isRecording ? (
        <div className="w-6 h-6 rounded-sm bg-status-danger" />
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
          <path
            d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4Z"
            fill="currentColor"
          />
          <path
            d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4m-3 0h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
