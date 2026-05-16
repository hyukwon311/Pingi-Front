# 🌀 핑이 (Pingi)

> 발음으로 측정하는 나의 취도

술자리에서 참가자들의 발음을 녹음하고 분석하여 취한 정도를 LV0~5로 측정하는 모바일 웹앱입니다.  
술 마시기 전 기준 발음(베이스라인)을 녹음한 뒤, 15분 간격으로 같은 문장을 다시 녹음하여 발음 변화율로 취도를 판단합니다.

## ✨ 주요 기능

### 🎭 캐릭터 시스템
- **6가지 견종 선택**: 덕배, 뽀삐, 콩이, 곰자, 눈송이, 멍구 중 나만의 캐릭터 선택
- **6단계 레벨 진화**: LV0(멀쩡) → LV5(만취)까지 취도에 따라 캐릭터 비주얼 변화
- **실시간 애니메이션**: wobble 효과와 레벨별 뱃지로 생동감 있는 표현

### 🎤 발음 측정
- **베이스라인 측정**: 술자리 시작 전 3개 잰말 문장 녹음으로 기준 설정
- **핑이타임**: 15분 간격 자동 측정 + 언제든 수동 측정 가능
- **발음 분석**: 베이스라인 대비 발음 변화율로 정확한 취도 계산

### 📊 술자리 관리
- **로그인 불필요**: 방 코드만으로 즉시 참여 가능
- **음주량 기록**: 소주, 맥주, 소맥, 와인, 양주별 잔 수 자동 계산 (소주환산)
- **실시간 대시보드**: 모든 멤버의 현재 취도 레벨 한눈에 확인
- **귀가 체크인**: 술자리 종료 후 안전한 귀가 확인 및 음성 후기

### 🔄 실시간 동기화 (WebSocket)
- **방장 시작 시**: 모든 멤버가 자동으로 캐릭터 확인 → 베이스라인 녹음 화면으로 이동
- **베이스라인 완료 시**: 모든 멤버가 완료하면 자동으로 핑이 Live 화면으로 동시 이동
- **핑이타임 트리거**: 한 명이 버튼 누르면 모두 녹음 화면으로 이동
- **타이머 종료**: 20분마다 자동으로 모든 멤버에게 핑이타임 알림
- **귀가 체크인**: 멤버가 귀가하면 실시간으로 다른 멤버에게 알림

### 🏆 결과 & 공유
- **시상식**: 주량왕, 최고/최저 레벨, 센스왕 등 4대 고정상 + 조건부 뱃지
- **인스타 카드**: 결과를 스토리(9:16) 또는 피드(1:1) 비율로 다운로드
- **무사 귀가 리포트**: 전체 통계 요약 및 귀가 완료 확인

---

## 🛠 기술 스택

| 분류       | 기술                     | 설명                                   |
| ---------- | ------------------------ | -------------------------------------- |
| 프레임워크 | React 19                 | 최신 React with Concurrent Features    |
| 언어       | TypeScript 6             | 타입 안전성 보장                       |
| 빌드       | Vite 8                   | 빠른 개발 서버 및 빌드                 |
| 스타일링   | Tailwind CSS 4           | @theme 기반 디자인 시스템              |
| 라우팅     | React Router 7           | 방 코드 기반 동적 라우팅               |
| 상태 관리  | Context API + useReducer | RoomContext, SessionContext            |
| 음성 녹음  | MediaRecorder API        | 브라우저 네이티브 음성 녹음            |
| 음성 인식  | Web Speech API           | 실시간 음성-텍스트 변환 (STT)          |
| 실시간     | Socket.io Client         | 멤버 입장, 핑이타임 등 실시간 이벤트   |
| 이미지     | html2canvas              | 인스타 카드 PNG 다운로드               |

---

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 9 이상
- **백엔드 서버** ([pingi-backend](../pingi-backend)) 실행 중

### 설치 및 실행

```bash
git clone https://github.com/<your-username>/pingi-front.git
cd pingi-front
npm install
```

### 환경변수 설정

`.env` 파일 생성:

```env
# REST API 엔드포인트
VITE_API_URL=http://localhost:8000/v1

# WebSocket 엔드포인트 (Socket.io)
VITE_WS_URL=http://localhost:8000
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

> **Note**: 마이크 권한이 필요한 기능(베이스라인, 핑이타임)을 테스트하려면 HTTPS 환경이 필요할 수 있습니다.

---

## 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

`dist/` 디렉토리에 정적 파일이 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

---

## 📁 프로젝트 구조

```
src/
├── pages/                  # 15개 페이지 컴포넌트
│   ├── Home.tsx                    # 메인 홈 화면
│   ├── CreateSession.tsx           # 방 생성
│   ├── JoinSession.tsx             # 방 참여
│   ├── CharacterSelect.tsx         # 캐릭터 선택
│   ├── ArrivalInfo.tsx             # 도착 정보 입력
│   ├── WaitingRoom.tsx             # 대기실 (WebSocket으로 room_started 수신)
│   ├── CharacterConfirm.tsx        # 캐릭터 확인
│   ├── BaselineTest.tsx            # 베이스라인 측정 (완료 후 all_baseline_complete 대기)
│   ├── SessionDashboard.tsx        # 술자리 메인 (핑이 Live)
│   ├── VoiceRecording.tsx          # 핑이타임 녹음
│   ├── SessionResult.tsx           # 핑이타임 결과
│   ├── Awards.tsx                  # 시상식
│   ├── InstagramCard.tsx           # 인스타 카드 (실제 데이터 표시)
│   ├── HomeCheckIn.tsx             # 귀가 체크인 (실시간 STT + 음성 녹음)
│   └── SafeReturn.tsx              # 무사 귀가 (실제 데이터 표시)
│
├── components/
│   ├── common/             # 공통 UI (Button, Card, Modal, Character 등)
│   ├── home/               # 홈 화면 전용 컴포넌트
│   ├── layout/             # 레이아웃 (AppLayout, Header)
│   ├── session/            # 세션 관련 (PingiTimeModal, DrunkLevelBadge 등)
│   └── voice/              # 음성 녹음 UI (RecordButton, VoiceWaveform)
│
├── services/               # API 및 WebSocket 서비스
│   ├── api.ts                      # REST API 호출 (백엔드 연동) ★
│   ├── websocket.ts                # Socket.io 클라이언트 ★
│   ├── sessionApi.ts               # 세션 관련 API
│   ├── userApi.ts                  # 사용자 API
│   └── voiceApi.ts                 # 음성 분석 API
│
├── hooks/                  # 커스텀 훅
│   ├── useVoiceRecorder.ts         # 음성 녹음
│   ├── useVoiceRecorderWithSTT.ts  # 음성 녹음 + 실시간 STT ★
│   ├── useWebSocket.ts             # WebSocket 연결 & 자동 네비게이션 ★
│   ├── useDrinkCount.ts            # 음주량 관리
│   ├── useTimer.ts                 # 카운트다운 타이머
│   ├── usePolling.ts               # 주기적 폴링
│   └── useSession.ts               # 세션 상태 접근
│
├── contexts/               # React Context
│   ├── RoomContext.tsx             # 방 참여 상태 (로그인 대체)
│   └── SessionContext.tsx          # 술자리 실시간 상태
│
├── types/                  # TypeScript 타입 정의
│   ├── room.ts                     # Room, Member 등
│   └── voice.ts                    # 음성 녹음 및 분석
│
├── constants/              # 상수
│   ├── routes.ts                   # 라우트 경로
│   ├── levels.ts                   # 취도 레벨 정의
│   └── sentences.ts                # 잰말 문장
│
└── utils/                  # 유틸리티 함수
    ├── drunkLevel.ts               # 취도 레벨 계산
    ├── formatTime.ts               # 시간 포맷팅
    └── share.ts                    # 링크 공유
```

> **★ 표시**: 백엔드 연동 시 중요한 파일들

---

## 🔄 주요 흐름

### 1️⃣ 방 생성 & 참여

```
홈 화면 → 방 만들기 OR 참가하기
         ↓
    초대 코드 생성/입력
         ↓
    캐릭터 선택 (6견종)
         ↓
    도착 정보 입력 (ETA, 공복도)
         ↓
      대기실 (WebSocket 연결)
```

### 2️⃣ 술자리 진행

```
대기실 → 방장 "다 모였어!" 버튼
        ↓
   [WebSocket: room_started → 모두 캐릭터 확인으로 이동]
        ↓
   캐릭터 확인 (모든 멤버)
        ↓
   베이스라인 측정 3회 (모든 멤버 개별 진행)
        ↓
   완료 후 대기 (다른 멤버 기다리기)
        ↓
   [WebSocket: all_baseline_complete → 모두 핑이 Live로 동시 이동]
        ↓
   술자리 메인 대시보드 (핑이 Live)
        ↓ (20분마다 또는 수동)
   [WebSocket: pingi_time_started → 모두 녹음 화면으로 이동]
        ↓
     핑이타임 측정 → 결과 확인
```

> **중요**: 모든 멤버가 각자 베이스라인 녹음을 완료해야 동시에 핑이 Live로 이동합니다.
> 이를 통해 핑이타임 타이머가 모든 멤버에게 동기화됩니다.

### 3️⃣ 종료 & 귀가

```
술자리 종료 → [WebSocket: room_ended → 모두 이동]
            ↓
         시상식
            ↓
       인스타 카드 생성
            ↓
        귀가 체크인 (음성 녹음 + 실시간 STT)
            ↓
   [WebSocket: home_checkin_result → 다른 멤버에게 실시간 알림]
            ↓
        무사 귀가
```

---

## 🔌 백엔드 연동

### API 호출 (`src/services/api.ts`)

모든 REST API 호출이 이 파일에 정의되어 있습니다:

```typescript
import { 
  createRoom, 
  joinRoom, 
  getRoom, 
  startRoom,
  updateMember, 
  addDrink,
  uploadBaseline,
  completeBaseline,
  triggerPingiTime,
  getFinalReport,
  checkInHome,
} from '@/services/api';

// 방 생성 (JWT 토큰 자동 저장)
const { room, host } = await createRoom({
  hostNickname: '핑이',
  location: '강남역',
  scheduledAt: new Date().toISOString(),
});

// 방 입장
const { member, room } = await joinRoom(code, nickname);

// 방 시작 (방장만, room_started 이벤트 발송)
await startRoom(code);

// 멤버 정보 수정
await updateMember(memberId, { breed: 'dukbae', arrived: true });

// 잔수 추가
await addDrink(memberId, 'soju', 1);

// 베이스라인 완료 알림 (all_baseline_complete 이벤트 트리거)
await completeBaseline(memberId);

// 핑이타임 트리거 (pingi_time_started 이벤트 발송)
await triggerPingiTime(code);

// 최종 리포트 조회
const report = await getFinalReport(code);

// 귀가 체크인 (음성 + STT)
await checkInHome(memberId, audioBlob, transcript);
```

### 토큰 관리

방 생성/입장 시 받은 JWT 토큰은 `localStorage`에 자동 저장됩니다:

```typescript
// api.ts 내부에서 자동 처리
localStorage.setItem('pingi_token', token);
localStorage.setItem('pingi_memberId', memberId);
```

---

## 🎯 WebSocket 실시간 이벤트

### useWebSocket 훅 (`src/hooks/useWebSocket.ts`)

WebSocket 연결 및 자동 네비게이션을 처리하는 핵심 훅:

```typescript
import { useWebSocket } from '@/hooks/useWebSocket';

function WaitingRoom() {
  const navigate = useNavigate();
  const { code } = useParams();
  
  // WebSocket 연결 및 이벤트 자동 처리
  useWebSocket({
    roomCode: code,
    onMemberJoined: () => fetchRoom(),  // 새 멤버 입장 시 새로고침
    // room_started → 자동으로 /r/:code/confirm 이동
    // pingi_time_started → 자동으로 /r/:code/record 이동
    // room_ended → 자동으로 /r/:code/awards 이동
  });
}
```

### 수신 이벤트 및 자동 동작

| 이벤트 | 설명 | 자동 동작 |
|--------|------|-----------|
| `member_joined` | 새 멤버 입장 | `onMemberJoined` 콜백 호출 |
| `member_updated` | 멤버 정보 변경 | 상태 업데이트 |
| `room_started` | 술자리 시작 | → `/r/:code/confirm` 이동 |
| `all_baseline_complete` | 모든 멤버 베이스라인 완료 | → `/r/:code/live` 이동 |
| `pingi_time_started` | 핑이타임 시작 | → `/r/:code/record` 이동 |
| `checkpoint_result` | 핑이타임 결과 | 결과 표시 |
| `room_ended` | 술자리 종료 | → `/r/:code/awards` 이동 |
| `home_checkin_result` | 귀가 체크인 완료 | 귀가 현황 업데이트 |

---

## 🎙️ 음성 녹음 + STT

### useVoiceRecorderWithSTT 훅 (`src/hooks/useVoiceRecorderWithSTT.ts`)

음성 녹음과 실시간 음성-텍스트 변환(STT)을 결합한 훅:

```typescript
import { useVoiceRecorderWithSTT } from '@/hooks/useVoiceRecorderWithSTT';

function HomeCheckIn() {
  const {
    isRecording,       // 녹음 중 여부
    audioBlob,         // 녹음된 오디오 Blob
    transcript,        // 최종 STT 결과
    interimTranscript, // 실시간 STT (인식 중)
    startRecording,    // 녹음 시작
    stopRecording,     // 녹음 종료 (Promise<Blob> 반환)
  } = useVoiceRecorderWithSTT();

  const handleStop = async () => {
    const blob = await stopRecording();  // 녹음 종료 후 Blob 반환
    await checkInHome(memberId, blob, transcript);
  };

  return (
    <div>
      {isRecording && <p>녹음 중: {interimTranscript}</p>}
      <p>인식된 텍스트: {transcript}</p>
    </div>
  );
}
```

> **Note**: Web Speech API는 Chrome 브라우저에서 가장 잘 작동합니다.

---

## 🎨 디자인 시스템

핑이는 Tailwind CSS 4의 `@theme` 기능을 활용한 일관된 디자인 시스템을 사용합니다.

### 컬러 팔레트

| 이름 | 용도 |
|------|------|
| `paper` | 배경색 |
| `grid` | 그리드 라인 |
| `ink` | 텍스트 |
| `highlight` | 강조 |
| `brown-{100-900}` | 갈색 계열 |
| `LV{0-5}` | 취도 레벨별 색상 |

### 폰트

- **Jua**: 디스플레이 폰트 (타이틀, 강조)
- **Inter**: 본문 폰트 (sans)

### 애니메이션

- `wobble`: 취한 캐릭터 흔들림
- `float`: 떠다니는 효과
- `blink`: 깜빡임
- `pulse`: 맥박 효과

---

## 📁 주요 파일 설명

### 서비스 (`src/services/`)

| 파일 | 설명 |
|------|------|
| `api.ts` | 백엔드 REST API 호출 (방, 멤버, 음주량, 베이스라인, 리포트, 귀가) |
| `websocket.ts` | Socket.io 클라이언트 (연결, 이벤트 구독, 메시지 송수신) |

### 훅 (`src/hooks/`)

| 파일 | 설명 |
|------|------|
| `useWebSocket.ts` | WebSocket 연결 관리 및 이벤트 기반 자동 네비게이션 |
| `useVoiceRecorder.ts` | 기본 음성 녹음 (MediaRecorder) |
| `useVoiceRecorderWithSTT.ts` | 음성 녹음 + Web Speech API 실시간 STT |
| `useDrinkCount.ts` | 음주량 상태 관리 |
| `useTimer.ts` | 핑이타임 카운트다운 타이머 |

### 페이지 (`src/pages/`)

| 파일 | 설명 |
|------|------|
| `WaitingRoom.tsx` | 대기실 (방장만 시작 가능, `room_started` 대기) |
| `BaselineTest.tsx` | 베이스라인 3회 녹음 후 `all_baseline_complete` 대기 |
| `SessionDashboard.tsx` | 핑이 Live 메인 화면 (음주량, 멤버 취도, 핑이타임 버튼) |
| `HomeCheckIn.tsx` | 귀가 체크인 (음성 녹음 + 실시간 STT + 음성 재생) |
| `InstagramCard.tsx` | 결과 공유 카드 (실제 데이터 표시) |
| `SafeReturn.tsx` | 무사 귀가 화면 (실제 귀가 현황 표시) |

---

## 🐛 트러블슈팅

### 마이크 권한 오류
- HTTPS 환경에서 테스트하거나, `localhost`에서 개발
- Chrome 브라우저 권한 설정 확인

### WebSocket 연결 실패
- 백엔드 서버가 실행 중인지 확인
- `.env`의 `VITE_WS_URL`이 올바른지 확인 (http://localhost:8000)
- 토큰이 유효한지 확인 (localStorage)

### STT가 작동하지 않음
- Chrome 브라우저 사용 권장
- 마이크 권한 허용 확인
- 인터넷 연결 상태 확인 (Web Speech API는 온라인 필요)

### 음성 재생 안됨
- 오디오 URL이 올바른지 확인
- 브라우저 자동재생 정책 확인 (사용자 상호작용 필요)

---

## 📝 라이선스

This project is private and proprietary.

## 👥 기여


---

**핑이 팀** | [pingi.app](https://pingi.app)
