/**
 * @file AuthContext.tsx - 인증(로그인) 상태 관리 Context
 *
 * 사용자의 로그인/로그아웃 상태를 전역으로 관리한다.
 * localStorage에 사용자 정보를 저장하여 새로고침 후에도 로그인이 유지된다.
 *
 * 사용법:
 * - 컴포넌트에서 `useAuth()` 훅으로 { user, login, logout }에 접근
 * - App.tsx에서 <AuthProvider>로 앱 전체를 감싸야 한다
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types/user'

/** 인증 Context가 제공하는 상태와 액션 */
interface AuthState {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

/**
 * 인증 상태를 제공하는 Provider 컴포넌트.
 * 초기화 시 localStorage에서 이전 로그인 정보를 복원한다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('pingi_user')
    return stored ? JSON.parse(stored) : null
  })

  /** 로그인: 사용자 정보를 state와 localStorage에 저장 */
  const login = useCallback((u: User) => {
    setUser(u)
    localStorage.setItem('pingi_user', JSON.stringify(u))
  }, [])

  /** 로그아웃: state를 초기화하고 localStorage에서 제거 */
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('pingi_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * 인증 상태에 접근하는 커스텀 훅.
 * AuthProvider 바깥에서 호출하면 에러를 던진다.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
