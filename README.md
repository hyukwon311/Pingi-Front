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

### 🏆 결과 & 공유
- **시상식**: 주량왕, 최고/최저 레벨, 센스왕 등 4대 고정상 + 조건부 뱃지
- **인스타 카드**: 결과를 스토리(9:16) 또는 피드(1:1) 비율로 다운로드
- **무사 귀가 리포트**: 전체 통계 요약 및 귀가 완료 확인

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
| 실시간     | WebSocket                | 멤버 입장, 핑이타임 등 실시간 이벤트   |
| 이미지     | html2canvas              | 인스타 카드 PNG 다운로드               |

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 9 이상

### 설치 및 실행

```bash
git clone https://github.com/<your-username>/pingi-front.git
cd pingi-front
npm install
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

> **Note**: 마이크 권한이 필요한 기능(베이스라인, 핑이타임)을 테스트하려면 HTTPS 환경이 필요할 수 있습니다.

### 환경변수

프로젝트 루트에 `.env` 파일을 생성하여 백엔드 API와 WebSocket 주소를 설정합니다.

```env
# REST API 엔드포인트
VITE_API_URL=https://api.pingi.app/v1

# WebSocket 엔드포인트
VITE_WS_URL=wss://api.pingi.app/v1/ws
```

설정하지 않으면 기본값이 사용됩니다. `.env.example` 파일을 참고하세요.

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

## 📁 프로젝트 구조

```
src/
├── pages/              # 15개 페이지 컴포넌트
│   ├── Home.tsx                    # 메인 홈 화면
│   ├── CreateSession.tsx           # 방 생성
│   ├── JoinSession.tsx             # 방 참여
│   ├── CharacterSelect.tsx         # 캐릭터 선택
│   ├── ArrivalInfo.tsx             # 도착 정보 입력
│   ├── WaitingRoom.tsx             # 대기실
│   ├── CharacterConfirm.tsx        # 캐릭터 확인
│   ├── BaselineTest.tsx            # 베이스라인 측정
│   ├── SessionDashboard.tsx        # 술자리 메인
│   ├── VoiceRecording.tsx          # 핑이타임 녹음
│   ├── SessionResult.tsx           # 핑이타임 결과
│   ├── Awards.tsx                  # 시상식
│   ├── InstagramCard.tsx           # 인스타 카드
│   ├── HomeCheckIn.tsx             # 귀가 체크인
│   └── SafeReturn.tsx              # 무사 귀가
│
├── components/
│   ├── common/         # 공통 UI (Button, Card, Modal, Character 등)
│   ├── home/           # 홈 화면 전용 컴포넌트
│   ├── layout/         # 레이아웃 (AppLayout, Header)
│   ├── session/        # 세션 관련 (PingiTimeModal, DrunkLevelBadge 등)
│   └── voice/          # 음성 녹음 UI (RecordButton, VoiceWaveform)
│
├── services/           # API 및 WebSocket 서비스
│   ├── api.ts                      # REST API 호출
│   ├── sessionApi.ts               # 세션 관련 API
│   ├── userApi.ts                  # 사용자 API
│   ├── voiceApi.ts                 # 음성 분석 API
│   └── websocket.ts                # WebSocket 연결 관리
│
├── hooks/              # 커스텀 훅
│   ├── useVoiceRecorder.ts         # 음성 녹음
│   ├── useDrinkCount.ts            # 음주량 관리
│   ├── useTimer.ts                 # 카운트다운 타이머
│   ├── usePolling.ts               # 주기적 폴링
│   └── useSession.ts               # 세션 상태 접근
│
├── contexts/           # React Context
│   ├── RoomContext.tsx             # 방 참여 상태 (로그인 대체)
│   └── SessionContext.tsx          # 술자리 실시간 상태
│
├── types/              # TypeScript 타입 정의
│   ├── room.ts                     # Room, Member 등
│   └── voice.ts                    # 음성 녹음 및 분석
│
├── constants/          # 상수
│   ├── routes.ts                   # 라우트 경로
│   ├── levels.ts                   # 취도 레벨 정의
│   └── sentences.ts                # 잰말 문장
│
└── utils/              # 유틸리티 함수
    ├── drunkLevel.ts               # 취도 레벨 계산
    ├── formatTime.ts               # 시간 포맷팅
    └── share.ts                    # 링크 공유
```

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
      대기실
```

### 2️⃣ 술자리 진행
```
대기실 → 방장 "다 모였어!" 버튼
        ↓
   캐릭터 확인
        ↓
   베이스라인 측정 (3회)
        ↓
   술자리 메인 대시보드
        ↓ (15분마다 또는 수동)
     핑이타임 측정
        ↓
      결과 확인
```

### 3️⃣ 종료 & 귀가
```
술자리 종료 → 시상식
            ↓
       인스타 카드 생성
            ↓
        귀가 체크인
            ↓
        무사 귀가
```

## 🎨 디자인 시스템

핑이는 Tailwind CSS 4의 `@theme` 기능을 활용한 일관된 디자인 시스템을 사용합니다.

- **컬러**: `paper`, `grid`, `ink`, `highlight`, `brown-{100-900}`, `LV{0-5}`
- **폰트**: Jua (display), Inter (sans)
- **그림자**: `shadow-card`
- **애니메이션**: wobble, float, blink, pulse 등

## 🔌 백엔드 개발자를 위한 가이드

### API 문서

프론트엔드가 요구하는 API 스펙은 다음 문서들을 참고하세요:

- **`pingi-docs/openapi.yaml`**: OpenAPI 3.0 스펙 (모든 REST API 엔드포인트)
- **`pingi-docs/swagger-ui.html`**: Swagger UI 인터페이스 (브라우저에서 열기)
- **`BACKEND-CHECKLIST.md`**: 구현 우선순위별 체크리스트

### 주요 API 엔드포인트

```
POST   /api/rooms                    # 방 생성
GET    /api/rooms/:code               # 방 조회
POST   /api/rooms/:code/members       # 멤버 참가
POST   /api/rooms/:code/start         # 술자리 시작
POST   /api/voice/baseline            # 베이스라인 녹음 저장
POST   /api/voice/test                # 핑이타임 녹음 분석
GET    /api/sessions/:id/results      # 술자리 결과 조회
```

### WebSocket 이벤트

클라이언트가 수신하는 이벤트:

```javascript
// 멤버 입장
{ type: 'member_joined', data: { member: Member } }

// ETA 변경
{ type: 'member_eta_updated', data: { memberId, eta } }

// 술자리 시작
{ type: 'session_started', data: { sessionId } }

// 핑이타임 발동
{ type: 'pingi_time_triggered', data: { sentence } }

// 핑이타임 결과
{ type: 'pingi_time_result', data: { results: MemberResult[] } }

// 술자리 종료
{ type: 'session_ended', data: { sessionId } }

// 귀가 상태 변경
{ type: 'home_checkin_updated', data: { memberId, status } }
```

### 현재 더미 데이터 사용 중

`src/services/api.ts`의 모든 함수는 현재 Mock 데이터를 반환합니다.  
백엔드 API 구현 완료 시 각 함수를 실제 `fetch` 호출로 교체하면 됩니다.

```typescript
// 예시: 현재 Mock → 실제 API로 교체
export async function createRoom(data: CreateRoomRequest): Promise<CreateRoomResponse> {
  // TODO: 실제 API 호출로 교체
  const response = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

## 📝 라이선스

This project is private and proprietary.

## 👥 기여


---

**핑이 팀** | [pingi.app](https://pingi.app)
