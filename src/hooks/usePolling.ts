/**
 * @file usePolling.ts - 주기적 폴링 훅
 *
 * 지정된 간격으로 콜백을 반복 실행한다.
 * 대기실에서 세션 상태를 주기적으로 갱신하거나,
 * 참가자 목록 변경을 감지하는 등의 용도로 사용한다.
 * 나중에 WebSocket으로 교체할 때 이 훅만 제거하면 된다.
 */
import { useEffect, useRef } from 'react'

interface UsePollingOptions {
  callback: () => void | Promise<void>
  intervalMs: number
  enabled?: boolean
}

export function usePolling({ callback, intervalMs, enabled = true }: UsePollingOptions) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled) return

    callbackRef.current()

    const id = setInterval(() => callbackRef.current(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, enabled])
}
