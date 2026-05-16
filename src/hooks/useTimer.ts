/**
 * @file useTimer.ts - 카운트다운 타이머 훅
 *
 * 지정된 시간(durationMs)부터 0까지 카운트다운하는 타이머를 제공한다.
 * 200ms 간격으로 남은 시간을 갱신하며, 완료 시 onComplete 콜백을 호출한다.
 * 세션 대시보드에서 "다음 발음 테스트까지" 카운트다운에 사용된다.
 *
 * @returns { remaining, isRunning, start, stop, reset }
 */
import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTimerOptions {
  durationMs: number     // 전체 시간 (밀리초)
  onComplete?: () => void // 타이머 완료 시 호출할 콜백
  autoStart?: boolean     // true면 마운트 즉시 시작
}

export function useTimer({ durationMs, onComplete, autoStart = false }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(durationMs)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const endTimeRef = useRef(0)

  /** 타이머 정지 */
  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  /** 타이머 시작 (현재 remaining부터 카운트다운) */
  const start = useCallback(() => {
    endTimeRef.current = Date.now() + remaining
    setIsRunning(true)
  }, [remaining])

  /** 타이머 리셋 (정지 + 초기 시간으로 복원) */
  const reset = useCallback(() => {
    stop()
    setRemaining(durationMs)
  }, [durationMs, stop])

  useEffect(() => {
    if (!isRunning) return
    endTimeRef.current = Date.now() + remaining

    intervalRef.current = setInterval(() => {
      const left = endTimeRef.current - Date.now()
      if (left <= 0) {
        setRemaining(0)
        stop()
        onComplete?.()
      } else {
        setRemaining(left)
      }
    }, 200)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  return { remaining, isRunning, start, stop, reset }
}
