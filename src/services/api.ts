/**
 * @file api.ts - API 서비스 레이어
 *
 * 백엔드 REST API와 통신하기 위한 서비스 함수들을 제공한다.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/v1';

// ─────────────────────────────────────────────────────────────
//   타입 정의
// ─────────────────────────────────────────────────────────────

export interface Room {
  id: string;
  code: string;
  location: string;
  scheduledAt: string;
  status: 'waiting' | 'live' | 'ended';
  shareUrl?: string;
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
let currentMemberId: string | null = null;

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

export function setCurrentMemberId(id: string | null) {
  currentMemberId = id;
  if (id) {
    localStorage.setItem('pingi_member_id', id);
  } else {
    localStorage.removeItem('pingi_member_id');
  }
}

export function getCurrentMemberId(): string | null {
  if (!currentMemberId) {
    currentMemberId = localStorage.getItem('pingi_member_id');
  }
  return currentMemberId;
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
    ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
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
  const response = await request<CreateRoomResponse>('/rooms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  // 토큰과 멤버ID 저장
  setAuthToken(response.host.token);
  setCurrentMemberId(response.host.id);
  
  return response;
}

/** GET /rooms/{code} - 방 정보 조회 */
export async function getRoom(code: string): Promise<Room> {
  return request<Room>(`/rooms/${code}`);
}

/** POST /rooms/{code}/members - 방 입장 */
export async function joinRoom(code: string, data: JoinRoomRequest): Promise<JoinRoomResponse> {
  const response = await request<JoinRoomResponse>(`/rooms/${code}/members`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  // 토큰과 멤버ID 저장
  setAuthToken(response.member.token);
  setCurrentMemberId(response.member.id);
  
  return response;
}

/** POST /rooms/{code}/start - 술자리 시작 (방장만) */
export async function startRoom(code: string): Promise<{ status: string; startedAt: string }> {
  return request(`/rooms/${code}/start`, { method: 'POST' });
}

/** POST /rooms/{code}/end - 술자리 종료 (방장만) */
export async function endRoom(code: string): Promise<{ status: string; reportId: string }> {
  return request(`/rooms/${code}/end`, { method: 'POST' });
}

/** POST /rooms/{code}/pingi - 핑이타임 트리거 (방장만) */
export async function triggerPingiTime(code: string): Promise<{
  id: string;
  roomId: string;
  index: number;
  sentence: string;
  startedAt: string;
}> {
  return request(`/rooms/${code}/pingi`, { method: 'POST' });
}

// ─────────────────────────────────────────────────────────────
//   멤버 (Member) API
// ─────────────────────────────────────────────────────────────

/** PATCH /members/{id} - 멤버 정보 업데이트 */
export async function updateMember(
  memberId: string,
  data: Partial<{ breed: string; arrivalEta: string; hungerLevel: number; arrived: boolean; etaPreset: string }>
): Promise<Member> {
  return request<Member>(`/members/${memberId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/** POST /members/{id}/drinks - 잔수 추가 */
export async function addDrink(
  memberId: string,
  type: string,
  delta: number
): Promise<{ drinks: Record<string, number>; sojuEquivalent: number }> {
  return request(`/members/${memberId}/drinks`, {
    method: 'POST',
    body: JSON.stringify({ type, delta }),
  });
}

// ─────────────────────────────────────────────────────────────
//   베이스라인 / 녹음 API
// ─────────────────────────────────────────────────────────────

/** POST /members/{id}/baseline - 베이스라인 업로드 */
export async function uploadBaseline(
  memberId: string,
  audioBlobs: Blob[],
  sentences: string[]
): Promise<{ baselineId: string; featureVector: Record<string, number> }> {
  const formData = new FormData();
  audioBlobs.forEach((blob, i) => formData.append(`audio_${i + 1}`, blob, `audio_${i + 1}.wav`));
  sentences.forEach((s, i) => formData.append(`sentence_${i + 1}`, s));
  
  return request(`/members/${memberId}/baseline`, {
    method: 'POST',
    body: formData,
  });
}

/** POST /members/{id}/baseline/complete - 베이스라인 완료 표시 (간단 버전) */
export async function completeBaseline(
  memberId: string
): Promise<{ message: string; allCompleted: boolean }> {
  return request(`/members/${memberId}/baseline/complete`, {
    method: 'POST',
  });
}

/** POST /checkpoints/{id}/recordings - 핑이타임 녹음 업로드 */
export async function uploadRecording(
  checkpointId: string,
  audioBlob: Blob
): Promise<{ recording: { id: string; score: number; level: number; previousLevel: number; delta: number } }> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  
  return request(`/checkpoints/${checkpointId}/recordings`, {
    method: 'POST',
    body: formData,
  });
}

// ─────────────────────────────────────────────────────────────
//   결과 / 리포트 API
// ─────────────────────────────────────────────────────────────

/** GET /checkpoints/{id}/results - 핑이타임 결과 */
export async function getCheckpointResult(checkpointId: string): Promise<CheckpointResult> {
  return request(`/checkpoints/${checkpointId}/results`);
}

/** GET /rooms/{code}/report - 최종 리포트 */
export async function getFinalReport(code: string): Promise<FinalReport> {
  return request(`/rooms/${code}/report`);
}

/** GET /rooms/{code}/share-card - 공유 카드 데이터 */
export async function getShareCard(code: string, aspect: '9:16' | '1:1' = '9:16'): Promise<{
  date: string;
  location: string;
  winner: string;
  members: { nickname: string; breed: string | null; level: number }[];
}> {
  return request(`/rooms/${code}/share-card?aspect=${aspect}`);
}

// ─────────────────────────────────────────────────────────────
//   귀가 API
// ─────────────────────────────────────────────────────────────

/** POST /members/{id}/home - 귀가 체크인 */
export async function checkInHome(
  memberId: string,
  audioBlob?: Blob,
  transcript?: string
): Promise<{ arrivedAt: string; transcript?: string | null }> {
  const formData = new FormData();
  if (audioBlob) {
    const ext = audioBlob.type.includes('webm')
      ? 'webm'
      : audioBlob.type.includes('mp4')
        ? 'mp4'
        : audioBlob.type.includes('ogg')
          ? 'ogg'
          : audioBlob.type.includes('mpeg')
            ? 'mp3'
            : 'wav';
    formData.append('audio', audioBlob, `review.${ext}`);
  }
  if (transcript) {
    formData.append('transcript', transcript);
  }
  
  return request(`/members/${memberId}/home`, {
    method: 'POST',
    body: (audioBlob || transcript) ? formData : undefined,
  });
}

/** GET /rooms/{code}/home-status - 귀가 상태 조회 (임시 - 백엔드 미구현) */
export async function getHomeStatus(code: string): Promise<{
  members: { nickname: string; breed: string; state: 'home' | 'moving' | 'pending'; arrivedAt?: string }[];
}> {
  // 현재 백엔드에 해당 API가 없으므로 room 데이터에서 추론
  const room = await getRoom(code);
  return {
    members: room.members.map(m => ({
      nickname: m.nickname,
      breed: m.breed || 'retriever',
      state: 'pending' as const,
    })),
  };
}

/** GET /rooms/{code}/reviews - 귀가 후기 조회 (임시 - 백엔드 미구현) */
export async function getReviews(_code: string): Promise<{
  reviews: { nickname: string; breed: string; text: string; audioUrl: string }[];
}> {
  // 현재 백엔드에 해당 API가 없으므로 빈 배열 반환
  return { reviews: [] };
}
