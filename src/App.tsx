/**
 * @file App.tsx - 루트 컴포넌트 및 라우팅 설정
 *
 * 핑이 앱의 전체 라우팅 구조를 정의하는 최상위 컴포넌트다.
 * React Router v6를 사용하며, RoomProvider와 SessionProvider로 전역 상태를 제공한다.
 * 로그인 없이 방 코드(roomCode) 기반으로 동작하며, 모든 페이지는 AppLayout으로 감싸진다.
 *
 * 주요 라우트 구조:
 * - "/" : 메인 홈 화면 (방 만들기 or 참가하기)
 * - "/new" : 방 생성 (장소, 시간, 닉네임 입력)
 * - "/r/:code" : 방 입장 (초대 정보 확인 + 닉네임 입력)
 * - "/r/:code/character" : 캐릭터(견종) 선택
 * - "/r/:code/arrival" : 도착 정보 입력 (ETA, 공복도)
 * - "/r/:code/lobby" : 대기실 (멤버 모집 대기)
 * - "/r/:code/confirm" : 캐릭터 확인
 * - "/r/:code/baseline" : 베이스라인 음성 녹음
 * - "/r/:code/live" : 술자리 메인 대시보드
 * - "/r/:code/record" : 핑이타임 녹음
 * - "/r/:code/result" : 핑이타임 결과
 * - "/r/:code/awards" : 시상식
 * - "/r/:code/share" : 인스타 카드 생성
 * - "/r/:code/home" : 귀가 체크인
 * - "/r/:code/done" : 무사 귀가 완료
 */
import { Routes, Route } from 'react-router-dom'
import { RoomProvider } from '@/contexts/RoomContext'
import { SessionProvider } from '@/contexts/SessionContext'
import AppLayout from '@/components/layout/AppLayout'

// 페이지 컴포넌트
import Home from '@/pages/Home'
import CreateSession from '@/pages/CreateSession'
import JoinSession from '@/pages/JoinSession'
import CharacterSelect from '@/pages/CharacterSelect'
import ArrivalInfo from '@/pages/ArrivalInfo'
import WaitingRoom from '@/pages/WaitingRoom'
import CharacterConfirm from '@/pages/CharacterConfirm'
import BaselineTest from '@/pages/BaselineTest'
import SessionDashboard from '@/pages/SessionDashboard'
import VoiceRecording from '@/pages/VoiceRecording'
import SessionResult from '@/pages/SessionResult'
import Awards from '@/pages/Awards'
import InstagramCard from '@/pages/InstagramCard'
import HomeCheckIn from '@/pages/HomeCheckIn'
import SafeReturn from '@/pages/SafeReturn'

export default function App() {
  return (
    <RoomProvider>
      <SessionProvider>
        <Routes>
          <Route element={<AppLayout />}>
            {/* 메인 */}
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<CreateSession />} />

            {/* 방 플로우 */}
            <Route path="/r/:code" element={<JoinSession />} />
            <Route path="/r/:code/character" element={<CharacterSelect />} />
            <Route path="/r/:code/arrival" element={<ArrivalInfo />} />
            <Route path="/r/:code/lobby" element={<WaitingRoom />} />
            <Route path="/r/:code/confirm" element={<CharacterConfirm />} />
            <Route path="/r/:code/baseline" element={<BaselineTest />} />
            <Route path="/r/:code/live" element={<SessionDashboard />} />
            <Route path="/r/:code/record" element={<VoiceRecording />} />
            <Route path="/r/:code/result" element={<SessionResult />} />
            <Route path="/r/:code/awards" element={<Awards />} />
            <Route path="/r/:code/share" element={<InstagramCard />} />
            <Route path="/r/:code/home" element={<HomeCheckIn />} />
            <Route path="/r/:code/done" element={<SafeReturn />} />
          </Route>
        </Routes>
      </SessionProvider>
    </RoomProvider>
  )
}
