/**
 * @file api.ts - API 서비스 레이어
 *
 * 백엔드 REST API와 통신하기 위한 서비스 함수들을 제공한다.
 * 현재는 더미 데이터를 반환하는 Mock API로 구현되어 있으며,
 * 백엔드 개발 완료 후 실제 fetch 호출로 교체할 예정이다.
 * 방 생성/조회, 멤버 참가, 음성 업로드, 발음 분석 등 핑이 앱의 모든 API 요청을 담당하며,
 * 각 API 함수는 TypeScript 타입으로 요청/응답 형식이 명확하게 정의되어 있다.
 * 환경 변수(VITE_API_URL)로 API 엔드포인트를 설정할 수 있다.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.pingi.app/v1';

// ─────────────────────────────────────────────────────────────
//   타입 정의
// ─────────────────────────────────────────────────────────────

export interface Room {
  id: string;
  code: string;
  location: string;
  scheduledAt: string;
  status: 'waiting' | 'live' | 'ended';
  members: Member[];
}

export interface Member {
  id: string;
  nickname: string;
  breed: string | null;
  isHost: boolean;
  arrived: boolean;
  etaPreset?: 'ontime' | 'late5' | 'late10' | 'late20';
  hungerLevel?: number;
  level?: number;
  drinks?: Record<string, number>;
}

export interface CreateRoomRequest {
  hostNickname: string;
  location: string;
  scheduledAt: string;
}

export interface CreateRoomResponse {
  room: Room;
  host: { id: string; nickname: string; token: string };
}

export interface JoinRoomRequest {
  nickname: string;
}

export interface JoinRoomResponse {
  member: { id: string; nickname: string; token: string };
  room: Room;
}

export interface CheckpointResult {
  checkpointId: string;
  index: number;
  rankings: {
    memberId: string;
    nickname: string;
    breed: string;
    level: number;
    previousLevel: number;
    delta: number;
    isNotDrinking?: boolean;
    isHungry?: boolean;
  }[];
  topDrunk: string;
  warnings: { type: string; memberId: string; message: string }[];
}

export interface FinalReport {
  awards: {
    type: 'top_drunk' | 'liver_guardian' | 'pacemaker' | 'accelerator';
    memberId: string;
    nickname: string;
    breed: string;
    description: string;
  }[];
  badges: {
    emoji: string;
    name: string;
    winner: string;
    reason: string;
  }[];
  timeline: {
    time: string;
    levels: number[];
  }[];
  stats: {
    pingiTimeCount: number;
    maxLevelMember: { nickname: string; level: number };
  };
}

// ─────────────────────────────────────────────────────────────
//   토큰 관리
// ─────────────────────────────────────────────────────────────

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('pingi_token', token);
  } else {
    localStorage.removeItem('pingi_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('pingi_token');
  }
  return authToken;
}

// ─────────────────────────────────────────────────────────────
//   HTTP 헬퍼
// ─────────────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─────────────────────────────────────────────────────────────
//   방 (Room) API
// ─────────────────────────────────────────────────────────────

/** POST /rooms - 방 생성 */
export async function createRoom(data: CreateRoomRequest): Promise<CreateRoomResponse> {
  // TODO: 실제 API 호출로 교체
  // return request('/rooms', { method: 'POST', body: JSON.stringify(data) });

  // 더미 응답
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return {
    room: {
      id: `r_${Date.now()}`,
      code,
      location: data.location,
      scheduledAt: data.scheduledAt,
      status: 'waiting',
      members: [],
    },
    host: {
      id: `m_${Date.now()}`,
      nickname: data.hostNickname,
      token: 'dummy_token',
    },
  };
}

/** GET /rooms/{code} - 방 정보 조회 */
export async function getRoom(code: string): Promise<Room> {
  // TODO: 실제 API 호출로 교체
  // return request(`/rooms/${code}`);

  // 더미 응답
  return {
    id: `r_${code}`,
    code,
    location: '강남역 4번출구',
    scheduledAt: new Date().toISOString(),
    status: 'waiting',
    members: [
      { id: 'm_1', nickname: '민준', breed: 'retriever', isHost: true, arrived: true },
      { id: 'm_2', nickname: '수진', breed: 'pomeranian', isHost: false, arrived: true },
      { id: 'm_3', nickname: '지훈', breed: 'shiba', isHost: false, arrived: false, etaPreset: 'late10' },
    ],
  };
}

/** POST /rooms/{code}/members - 방 입장 */
export async function joinRoom(code: string, data: JoinRoomRequest): Promise<JoinRoomResponse> {
  // TODO: 실제 API 호출로 교체
  // return request(`/rooms/${code}/members`, { method: 'POST', body: JSON.stringify(data) });

  const room = await getRoom(code);
  const member = {
    id: `m_${Date.now()}`,
    nickname: data.nickname,
    token: 'dummy_token',
  };
  return { member, room };
}

/** POST /rooms/{code}/start - 술자리 시작 (방장만) */
export async function startRoom(code: string): Promise<{ status: string; startedAt: string }> {
  // TODO: 실제 API 호출로 교체
  // return request(`/rooms/${code}/start`, { method: 'POST' });

  return { status: 'live', startedAt: new Date().toISOString() };
}

/** POST /rooms/{code}/end - 술자리 종료 (방장만) */
export async function endRoom(code: string): Promise<{ status: string; reportId: string }> {
  // TODO: 실제 API 호출로 교체
  // return request(`/rooms/${code}/end`, { method: 'POST' });

  return { status: 'ended', reportId: `rpt_${Date.now()}` };
}

// ─────────────────────────────────────────────────────────────
//   멤버 (Member) API
// ─────────────────────────────────────────────────────────────

/** PATCH /members/{id} - 멤버 정보 업데이트 */
export async function updateMember(
  memberId: string,
  data: Partial<{ breed: string; arrivalEta: string; hungerLevel: number; arrived: boolean }>
): Promise<Member> {
  // TODO: 실제 API 호출로 교체
  // return request(`/members/${memberId}`, { method: 'PATCH', body: JSON.stringify(data) });

  return {
    id: memberId,
    nickname: '나',
    breed: data.breed || null,
    isHost: false,
    arrived: data.arrived ?? false,
  };
}

/** POST /members/{id}/drinks - 잔수 추가 */
export async function addDrink(
  memberId: string,
  type: string,
  delta: number
): Promise<{ drinks: Record<string, number>; sojuEquivalent: number }> {
  // TODO: 실제 API 호출로 교체
  // return request(`/members/${memberId}/drinks`, { method: 'POST', body: JSON.stringify({ type, delta }) });

  return {
    drinks: { [type]: delta > 0 ? delta : 0 },
    sojuEquivalent: delta,
  };
}

// ─────────────────────────────────────────────────────────────
//   베이스라인 / 녹음 API
// ─────────────────────────────────────────────────────────────

/** POST /members/{id}/baseline - 베이스라인 업로드 */
export async function uploadBaseline(
  memberId: string,
  audioBlobs: Blob[],
  sentences: string[]
): Promise<{ baselineId: string }> {
  // TODO: 실제 API 호출로 교체 (multipart/form-data)
  // const formData = new FormData();
  // audioBlobs.forEach((blob, i) => formData.append(`audio_${i + 1}`, blob));
  // sentences.forEach((s, i) => formData.append(`sentence_${i + 1}`, s));
  // return request(`/members/${memberId}/baseline`, { method: 'POST', body: formData });

  return { baselineId: `bl_${Date.now()}` };
}

/** POST /checkpoints/{id}/recordings - 핑이타임 녹음 업로드 */
export async function uploadRecording(
  checkpointId: string,
  audioBlob: Blob
): Promise<{ recording: { id: string; score: number; level: number; delta: number } }> {
  // TODO: 실제 API 호출로 교체 (multipart/form-data)

  return {
    recording: {
      id: `rec_${Date.now()}`,
      score: Math.random(),
      level: Math.floor(Math.random() * 5) + 1,
      delta: Math.floor(Math.random() * 3),
    },
  };
}

// ─────────────────────────────────────────────────────────────
//   결과 / 리포트 API
// ─────────────────────────────────────────────────────────────

/** GET /checkpoints/{id}/result - 핑이타임 결과 */
export async function getCheckpointResult(checkpointId: string): Promise<CheckpointResult> {
  // TODO: 실제 API 호출로 교체
  // return request(`/checkpoints/${checkpointId}/result`);

  return {
    checkpointId,
    index: 3,
    rankings: [
      { memberId: 'm_1', nickname: '민준', breed: 'retriever', level: 4, previousLevel: 2, delta: 2 },
      { memberId: 'm_2', nickname: '수진', breed: 'pomeranian', level: 3, previousLevel: 2, delta: 1, isHungry: true },
      { memberId: 'm_3', nickname: '지훈', breed: 'shiba', level: 2, previousLevel: 2, delta: 0 },
      { memberId: 'm_4', nickname: '수아', breed: 'poodle', level: 0, previousLevel: 0, delta: 0, isNotDrinking: true },
    ],
    topDrunk: 'm_1',
    warnings: [
      { type: 'hunger', memberId: 'm_2', message: '공복으로 시작한 수진, 밥 좀 든든하게 먹어요 🍚' },
    ],
  };
}

/** GET /rooms/{code}/report - 최종 리포트 */
export async function getFinalReport(code: string): Promise<FinalReport> {
  // TODO: 실제 API 호출로 교체
  // return request(`/rooms/${code}/report`);

  return {
    awards: [
      { type: 'top_drunk', memberId: 'm_1', nickname: '민준', breed: 'retriever', description: 'Level 5 달성' },
      { type: 'liver_guardian', memberId: 'm_4', nickname: '수아', breed: 'poodle', description: '끝까지 Level 1 사수' },
      { type: 'pacemaker', memberId: 'm_3', nickname: '지훈', breed: 'shiba', description: 'Level 3에서 멈춤' },
      { type: 'accelerator', memberId: 'm_2', nickname: '수진', breed: 'pomeranian', description: '레벨 상승 속도 1위' },
    ],
    badges: [
      { emoji: '🫠', name: '알쓰', winner: '민준', reason: '첫 핑이타임 L2' },
      { emoji: '🚂', name: '폭주기관차', winner: '민준', reason: '3회차 +2' },
    ],
    timeline: [
      { time: '19:30', levels: [0, 0, 0, 0] },
      { time: '20:00', levels: [1, 1, 0, 0] },
      { time: '20:30', levels: [2, 2, 1, 0] },
      { time: '21:00', levels: [4, 3, 2, 1] },
      { time: '21:30', levels: [5, 4, 3, 1] },
    ],
    stats: {
      pingiTimeCount: 6,
      maxLevelMember: { nickname: '민준', level: 5 },
    },
  };
}

// ─────────────────────────────────────────────────────────────
//   귀가 API
// ─────────────────────────────────────────────────────────────

/** POST /members/{id}/home - 귀가 체크인 */
export async function checkInHome(
  memberId: string,
  audioBlob?: Blob
): Promise<{ arrivedAt: string; transcript?: string }> {
  // TODO: 실제 API 호출로 교체

  return {
    arrivedAt: new Date().toISOString(),
    transcript: '오늘 진짜 재밌었다~ 다음에 또 하자!',
  };
}

/** GET /rooms/{code}/home-status - 귀가 상태 조회 */
export async function getHomeStatus(code: string): Promise<{
  members: { nickname: string; breed: string; state: 'home' | 'moving' | 'pending'; arrivedAt?: string }[];
}> {
  // TODO: 실제 API 호출로 교체

  return {
    members: [
      { nickname: '민준', breed: 'retriever', state: 'home', arrivedAt: '23:12' },
      { nickname: '수진', breed: 'pomeranian', state: 'moving' },
      { nickname: '지훈', breed: 'shiba', state: 'home', arrivedAt: '23:08' },
      { nickname: '수아', breed: 'poodle', state: 'pending' },
    ],
  };
}

/** GET /rooms/{code}/reviews - 귀가 후기 조회 */
export async function getReviews(code: string): Promise<{
  reviews: { nickname: string; breed: string; text: string; audioUrl: string }[];
}> {
  // TODO: 실제 API 호출로 교체

  return {
    reviews: [
      { nickname: '민준', breed: 'retriever', text: '오늘 진짜 재밌었다~ 다음에 또 하자!', audioUrl: '' },
      { nickname: '지훈', breed: 'shiba', text: '막차 겨우 탔어 ㅋㅋㅋ 다들 잘 들어가~', audioUrl: '' },
    ],
  };
}
