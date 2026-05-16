/**
 * @file App.tsx - 루트 컴포넌트 및 라우팅 설정
 *
 * 앱 전체의 라우팅 구조를 정의하는 최상위 컴포넌트.
 * AuthProvider와 SessionProvider로 전역 상태를 제공하고,
 * 페이지별 경로를 매핑한다.
 *
 * 라우트 구조:
 * - "/" : 스플래시 화면
 * - "/login" : 로그인 (닉네임 입력)
 * - TabLayout (하단 탭 바가 있는 레이아웃):
 *   - "/home" : 홈 화면
 *   - "/history" : 술자리 기록
 *   - "/mypage" : 마이페이지
 * - 세션 관련 (탭 바 없음):
 *   - "/session/create" : 새 술자리 생성
 *   - "/session/join" : 초대 코드로 참가
 *   - "/session/:id/waiting" : 대기실
 *   - "/session/:id/baseline" : 기준 발음 측정
 *   - "/session/:id/record" : 발음 테스트 녹음
 *   - "/session/:id" : 세션 대시보드 (진행 중)
 *   - "/session/:id/result" : 세션 결과
 */
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { SessionProvider } from '@/contexts/SessionContext'
import AppLayout from '@/components/layout/AppLayout'
import TabLayout from '@/components/layout/TabLayout'
import Splash from '@/pages/Splash'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import History from '@/pages/History'
import MyPage from '@/pages/MyPage'
import CreateSession from '@/pages/CreateSession'
import JoinSession from '@/pages/JoinSession'
import WaitingRoom from '@/pages/WaitingRoom'
import BaselineTest from '@/pages/BaselineTest'
import VoiceRecording from '@/pages/VoiceRecording'
import SessionDashboard from '@/pages/SessionDashboard'
import SessionResult from '@/pages/SessionResult'

export default function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <Routes>
          {/* AppLayout: 모든 페이지의 공통 레이아웃 (배경색 등) */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />

            {/* TabLayout: 하단 탭 바가 포함된 메인 화면들 */}
            <Route element={<TabLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/mypage" element={<MyPage />} />
            </Route>

            {/* 세션 플로우: 생성 → 참가 → 대기 → 기준측정 → 진행 → 결과 */}
            <Route path="/session/create" element={<CreateSession />} />
            <Route path="/session/join" element={<JoinSession />} />
            <Route path="/session/:id/waiting" element={<WaitingRoom />} />
            <Route path="/session/:id/baseline" element={<BaselineTest />} />
            <Route path="/session/:id/record" element={<VoiceRecording />} />
            <Route path="/session/:id" element={<SessionDashboard />} />
            <Route path="/session/:id/result" element={<SessionResult />} />
          </Route>
        </Routes>
      </SessionProvider>
    </AuthProvider>
  )
}
