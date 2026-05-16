/**
 * @file Character.tsx - 핑이 캐릭터 컴포넌트
 *
 * 핑이 앱의 핵심 비주얼 요소인 강아지 캐릭터를 렌더링하는 컴포넌트다.
 * 6개 견종(덕배, 뽀삐, 콩이, 곰자, 눈송이, 멍구)과 6단계 레벨(LV0~LV5)의 조합으로
 * 총 36가지 캐릭터 상태를 SVG로 표현하며, 레벨이 높아질수록 캐릭터가 점점 취한 모습으로 변화한다.
 * wobble 애니메이션, 레벨 뱃지, 크기 옵션(xs, sm, md, lg) 등을 제공하여
 * 다양한 화면(대기실, 술자리 대시보드, 결과 화면 등)에서 일관된 캐릭터 표시를 지원한다.
 * 모든 SVG 경로는 Character.module.css의 애니메이션과 함께 동작한다.
 */
import { useId, type CSSProperties, type ReactNode } from 'react';
import styles from './Character.module.css';
import type { CharacterBreed } from '@/types/room';

// ─────────────────────────────────────────────────────────────
//   타입 정의
// ─────────────────────────────────────────────────────────────

export type Breed =
  | 'retriever'
  | 'pomeranian'
  | 'shiba'
  | 'dachshund'
  | 'poodle'
  | 'bulldog';

export type Level = 0 | 1 | 2 | 3 | 4 | 5;

export const BREEDS: Record<Breed, { name: string; en: string; tag: string }> = {
  retriever:  { name: '덕배',   en: 'Golden Retriever', tag: '처진 귀 · 노란 털' },
  pomeranian: { name: '뽀삐',   en: 'Pomeranian',       tag: '솜뭉치 · 주황' },
  shiba:      { name: '콩이',   en: 'Shiba Inu',         tag: '삼각 귀 · 흰 마스크' },
  dachshund:  { name: '곰자',   en: 'Dachshund',         tag: '긴 몸 · 짧은 다리' },
  poodle:     { name: '눈송이', en: 'Poodle',            tag: '곱슬 · 흰 털' },
  bulldog:    { name: '멍구',   en: 'Bulldog',           tag: '주름 · 처진 입' },
};

export const LEVEL_INFO: Record<Level, { tag: string; name: string; description: string }> = {
  0: { tag: 'LV 0',   name: '멀쩡',       description: '베이스라인과 유사' },
  1: { tag: 'LV 1',   name: '달아오름',   description: '미세한 변화 감지' },
  2: { tag: 'LV 2',   name: '기분 좋음',   description: '변화 확인됨' },
  3: { tag: 'LV 3 ⚠', name: '꽤 취함',     description: '주의 필요' },
  4: { tag: 'LV 4',   name: '많이 취함',   description: '명확한 변화' },
  5: { tag: 'LV 5',   name: '꽐라 💀',     description: '큰 변화' },
};

// ─────────────────────────────────────────────────────────────
//   메인 컴포넌트
// ─────────────────────────────────────────────────────────────

type SizePreset = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<SizePreset, number> = {
  xs: 36,
  sm: 48,
  md: 64,
  lg: 80,
  xl: 100,
};

export interface CharacterProps {
  breed: Breed | CharacterBreed;
  level?: Level | number;
  size?: SizePreset | number;
  showName?: boolean;
  showLevel?: boolean;
  showBadge?: boolean;
  showEffects?: boolean;
  className?: string;
  style?: CSSProperties;
  userNickname?: string;
}

export function Character({
  breed,
  level = 0,
  size = 'md',
  showName = false,
  showLevel = false,
  showBadge = false,
  showEffects = true,
  className,
  style,
  userNickname,
}: CharacterProps) {
  const reactId = useId().replace(/:/g, '');
  const safeLevel = Math.min(5, Math.max(0, level)) as Level;
  const filterId = `pingi-${reactId}-${breed}-${safeLevel}`;
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];

  const Renderer = SVG_RENDERERS[breed as Breed]?.[safeLevel];
  if (!Renderer) return null;

  return (
    <div
      className={[
        styles.cell,
        safeLevel >= 3 ? styles.warn : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      data-level={safeLevel}
      style={style}
      aria-label={`${BREEDS[breed as Breed].name} ${LEVEL_INFO[safeLevel].name}`}
    >
      {showEffects && safeLevel >= 3 && <FloatingFx level={safeLevel} />}
      <svg
        viewBox="0 0 100 120"
        width={pixelSize}
        height={pixelSize * 1.2}
        className={styles.svg}
      >
        {Renderer(filterId)}
      </svg>
      {userNickname && <div className={styles.nickname}>{userNickname}</div>}
      {(showLevel || showBadge) && <div className={styles.levelTag}>{LEVEL_INFO[safeLevel].tag}</div>}
      {showName && <div className={styles.levelName}>{LEVEL_INFO[safeLevel].name}</div>}
    </div>
  );
}

// 떠다니는 이펙트 (3단계 이상)
function FloatingFx({ level }: { level: Level }): ReactNode {
  if (level === 3) {
    return <span className={`${styles.fx} ${styles.fxTopRight}`}>💗</span>;
  }
  if (level === 4) {
    return (
      <>
        <span className={`${styles.fx} ${styles.fxTopRight}`}>🌀</span>
        <span className={`${styles.fx} ${styles.fxTopLeft}`}>💦</span>
      </>
    );
  }
  if (level === 5) {
    return (
      <>
        <span className={`${styles.fx} ${styles.fxTopRight}`}>⭐</span>
        <span className={`${styles.fx} ${styles.fxTopLeft}`}>💫</span>
        <span className={`${styles.fx} ${styles.fxTopCenter}`}>✨</span>
      </>
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
//   SVG 렌더러 (36장)
// ─────────────────────────────────────────────────────────────

type Renderer = (filterId: string) => ReactNode;

const turbulence = (id: string, baseFreq: number, seed: number, scale: number) => (
  <defs>
    <filter id={id}>
      <feTurbulence baseFrequency={baseFreq} seed={seed} />
      <feDisplacementMap in="SourceGraphic" scale={scale} />
    </filter>
  </defs>
);

// 공통: 별눈 + 입 (꽐라용)
const drunkFace = (
  <>
    <g fill="none" stroke="#2a1a0a" strokeWidth={1.8} strokeLinecap="round">
      <path d="M 36 60 Q 42 56 44 62 Q 42 66 38 64" />
      <path d="M 56 60 Q 62 56 64 62 Q 62 66 58 64" />
    </g>
    <ellipse cx="50" cy="72" rx={3} ry={2} fill="#2a1a0a" />
    <ellipse cx="50" cy="82" rx={5} ry={4} fill="#2a1a0a" />
    <ellipse cx="50" cy="83" rx={3.5} ry={2.5} fill="#ff5675" />
  </>
);

const zzz = (
  <g fontFamily="Inter, sans-serif" fontWeight={700} fill="#999" fontStyle="italic">
    <text x="70" y="32" fontSize="13">z</text>
    <text x="80" y="22" fontSize="10">z</text>
    <text x="88" y="14" fontSize="8">z</text>
  </g>
);

// ─── RETRIEVER ────────────────────────────────────────────
const retrieverBase = (
  <>
    <ellipse cx="22" cy="60" rx="12" ry="22" fill="#d4a04a" />
    <ellipse cx="78" cy="60" rx="12" ry="22" fill="#d4a04a" />
    <path d="M 50 24 C 22 24 18 60 22 82 C 26 105 74 105 78 82 C 82 60 78 24 50 24 Z" fill="#f4c560" />
  </>
);

const SVG_RENDERERS: Record<Breed, Record<Level, Renderer>> = {
  retriever: {
    0: (f) => (
      <>{turbulence(f, 0.025, 1, 1)}
        <g filter={`url(#${f})`}>
          {retrieverBase}
          <circle cx="40" cy="62" r={3.2} fill="#2a1a0a" /><circle cx="41" cy="61" r={0.9} fill="#fff" />
          <circle cx="60" cy="62" r={3.2} fill="#2a1a0a" /><circle cx="61" cy="61" r={0.9} fill="#fff" />
          <ellipse cx="50" cy="74" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 45 80 Q 50 84 55 80" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    1: (f) => (
      <>{turbulence(f, 0.025, 2, 1.1)}
        <g filter={`url(#${f})`}>
          {retrieverBase}
          <circle cx="34" cy="70" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="66" cy="70" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="40" cy="62" r={3.2} fill="#2a1a0a" /><circle cx="41" cy="61" r={0.9} fill="#fff" />
          <circle cx="60" cy="62" r={3.2} fill="#2a1a0a" /><circle cx="61" cy="61" r={0.9} fill="#fff" />
          <ellipse cx="50" cy="74" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 45 80 Q 50 85 55 80" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    2: (f) => (
      <>{turbulence(f, 0.03, 3, 1.3)}
        <g filter={`url(#${f})`}>
          {retrieverBase}
          <circle cx="34" cy="70" r={7} fill="#ff8fa3" opacity={0.8} />
          <circle cx="66" cy="70" r={7} fill="#ff8fa3" opacity={0.8} />
          <path d="M 36 60 Q 40 57 44 60" stroke="#2a1a0a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <path d="M 56 60 Q 60 57 64 60" stroke="#2a1a0a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="74" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 42 80 Q 50 88 58 80" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <rect x="84" y="86" width={10} height={14} fill="#ffd166" stroke="#2a1a0a" strokeWidth={1.2} />
        </g>
      </>
    ),
    3: (f) => (
      <>{turbulence(f, 0.04, 4, 1.7)}
        <g filter={`url(#${f})`}>
          <ellipse cx="22" cy="66" rx="12" ry="22" fill="#d4a04a" />
          <ellipse cx="78" cy="62" rx="12" ry="22" fill="#d4a04a" />
          <path d="M 50 24 C 22 24 18 60 22 82 C 26 105 74 105 78 82 C 82 60 78 24 50 24 Z" fill="#f4c560" />
          <circle cx="32" cy="72" r={9} fill="#ff5675" opacity={0.85} />
          <circle cx="68" cy="72" r={9} fill="#ff5675" opacity={0.85} />
          <path d="M 36 64 Q 40 68 44 64" stroke="#2a1a0a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <path d="M 56 64 Q 60 68 64 64" stroke="#2a1a0a" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="76" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 44 84 Q 50 80 56 84 Q 53 88 50 86" stroke="#2a1a0a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    4: (f) => (
      <>{turbulence(f, 0.05, 5, 2.2)}
        <g filter={`url(#${f})`}>
          <ellipse cx="22" cy="70" rx="12" ry="22" fill="#d4a04a" />
          <ellipse cx="78" cy="70" rx="12" ry="22" fill="#d4a04a" />
          <path d="M 50 24 C 22 24 18 60 22 82 C 26 105 74 105 78 82 C 82 60 78 24 50 24 Z" fill="#f4c560" />
          <ellipse cx="50" cy="72" rx="32" ry="20" fill="#ff5675" opacity={0.35} />
          <circle cx="30" cy="72" r={11} fill="#ff2d55" opacity={0.9} />
          <circle cx="70" cy="72" r={11} fill="#ff2d55" opacity={0.9} />
          <g stroke="#2a1a0a" strokeWidth={2.2} strokeLinecap="round">
            <line x1="36" y1="58" x2="44" y2="66" /><line x1="44" y1="58" x2="36" y2="66" />
            <line x1="56" y1="58" x2="64" y2="66" /><line x1="64" y1="58" x2="56" y2="66" />
          </g>
          <ellipse cx="50" cy="76" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 44 84 Q 50 92 56 84" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="88" rx={4} ry={3} fill="#ff8fa3" />
        </g>
      </>
    ),
    5: (f) => (
      <>{turbulence(f, 0.06, 6, 2.7)}
        <g filter={`url(#${f})`} transform="rotate(78 50 64)">
          <ellipse cx="22" cy="70" rx="12" ry="22" fill="#d4a04a" />
          <ellipse cx="78" cy="70" rx="12" ry="22" fill="#d4a04a" />
          <path d="M 50 24 C 22 24 18 60 22 82 C 26 105 74 105 78 82 C 82 60 78 24 50 24 Z" fill="#f4c560" />
          <ellipse cx="50" cy="72" rx="34" ry="22" fill="#ff2d55" opacity={0.4} />
          <circle cx="28" cy="72" r={12} fill="#ff0a3c" opacity={0.85} />
          <circle cx="72" cy="72" r={12} fill="#ff0a3c" opacity={0.85} />
          {drunkFace}
        </g>
        {zzz}
      </>
    ),
  },

  // ─── POMERANIAN ────────────────────────────────────────────
  pomeranian: {
    0: (f) => (
      <>{turbulence(f, 0.04, 10, 1.4)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={36} fill="#f4956b" />
          <circle cx="22" cy="50" r={10} fill="#f4956b" /><circle cx="78" cy="50" r={10} fill="#f4956b" />
          <circle cx="20" cy="75" r={9} fill="#f4956b" /><circle cx="80" cy="75" r={9} fill="#f4956b" />
          <circle cx="50" cy="32" r={9} fill="#f4956b" />
          <path d="M 35 28 L 32 18 L 42 26 Z" fill="#d97a4e" />
          <path d="M 65 28 L 68 18 L 58 26 Z" fill="#d97a4e" />
          <circle cx="40" cy="60" r={3} fill="#2a1a0a" /><circle cx="41" cy="59" r={0.8} fill="#fff" />
          <circle cx="60" cy="60" r={3} fill="#2a1a0a" /><circle cx="61" cy="59" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="70" rx={2.5} ry={1.8} fill="#2a1a0a" />
          <path d="M 46 75 Q 50 78 54 75" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    1: (f) => (
      <>{turbulence(f, 0.04, 11, 1.4)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={36} fill="#f4956b" />
          <circle cx="22" cy="50" r={10} fill="#f4956b" /><circle cx="78" cy="50" r={10} fill="#f4956b" />
          <circle cx="20" cy="75" r={9} fill="#f4956b" /><circle cx="80" cy="75" r={9} fill="#f4956b" />
          <circle cx="50" cy="32" r={9} fill="#f4956b" />
          <path d="M 35 28 L 32 18 L 42 26 Z" fill="#d97a4e" />
          <path d="M 65 28 L 68 18 L 58 26 Z" fill="#d97a4e" />
          <circle cx="34" cy="68" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="66" cy="68" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="40" cy="60" r={3} fill="#2a1a0a" /><circle cx="41" cy="59" r={0.8} fill="#fff" />
          <circle cx="60" cy="60" r={3} fill="#2a1a0a" /><circle cx="61" cy="59" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="70" rx={2.5} ry={1.8} fill="#2a1a0a" />
          <path d="M 46 75 Q 50 78 54 75" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    2: (f) => (
      <>{turbulence(f, 0.04, 12, 1.5)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={36} fill="#f4956b" />
          <circle cx="22" cy="50" r={10} fill="#f4956b" /><circle cx="78" cy="50" r={10} fill="#f4956b" />
          <circle cx="20" cy="75" r={9} fill="#f4956b" /><circle cx="80" cy="75" r={9} fill="#f4956b" />
          <circle cx="50" cy="32" r={9} fill="#f4956b" />
          <path d="M 35 28 L 32 18 L 42 26 Z" fill="#d97a4e" />
          <path d="M 65 28 L 68 18 L 58 26 Z" fill="#d97a4e" />
          <circle cx="34" cy="68" r={7} fill="#ff8fa3" opacity={0.8} />
          <circle cx="66" cy="68" r={7} fill="#ff8fa3" opacity={0.8} />
          <path d="M 36 60 Q 40 57 44 60" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 60 Q 60 57 64 60" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="70" rx={2.5} ry={1.8} fill="#2a1a0a" />
          <path d="M 44 76 Q 50 82 56 76" stroke="#2a1a0a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <rect x="80" y="86" width={10} height={14} fill="#ffd166" stroke="#2a1a0a" strokeWidth={1.2} />
        </g>
      </>
    ),
    3: (f) => (
      <>{turbulence(f, 0.05, 13, 2)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={36} fill="#f4956b" />
          <circle cx="22" cy="52" r={10} fill="#f4956b" /><circle cx="78" cy="52" r={10} fill="#f4956b" />
          <circle cx="20" cy="77" r={9} fill="#f4956b" /><circle cx="80" cy="77" r={9} fill="#f4956b" />
          <circle cx="50" cy="32" r={9} fill="#f4956b" />
          <path d="M 35 28 Q 30 22 28 30 Q 32 32 40 30 Z" fill="#d97a4e" />
          <path d="M 65 28 L 68 18 L 58 26 Z" fill="#d97a4e" />
          <circle cx="32" cy="70" r={9} fill="#ff5675" opacity={0.85} />
          <circle cx="68" cy="70" r={9} fill="#ff5675" opacity={0.85} />
          <path d="M 36 62 Q 40 66 44 62" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 62 Q 60 66 64 62" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="72" rx={2.5} ry={1.8} fill="#2a1a0a" />
          <path d="M 44 80 Q 50 76 56 80 Q 53 84 50 82" stroke="#2a1a0a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    4: (f) => (
      <>{turbulence(f, 0.06, 14, 2.5)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={36} fill="#f4956b" />
          <circle cx="22" cy="54" r={10} fill="#f4956b" /><circle cx="78" cy="54" r={10} fill="#f4956b" />
          <circle cx="20" cy="80" r={9} fill="#f4956b" /><circle cx="80" cy="80" r={9} fill="#f4956b" />
          <circle cx="50" cy="34" r={9} fill="#f4956b" />
          <path d="M 35 28 Q 28 24 26 32 Q 32 34 40 32 Z" fill="#d97a4e" />
          <path d="M 65 28 Q 72 24 74 32 Q 68 34 60 32 Z" fill="#d97a4e" />
          <ellipse cx="50" cy="68" rx="32" ry="18" fill="#ff5675" opacity={0.35} />
          <circle cx="30" cy="70" r={11} fill="#ff2d55" opacity={0.9} />
          <circle cx="70" cy="70" r={11} fill="#ff2d55" opacity={0.9} />
          <g stroke="#2a1a0a" strokeWidth={2.2} strokeLinecap="round">
            <line x1="36" y1="56" x2="44" y2="64" /><line x1="44" y1="56" x2="36" y2="64" />
            <line x1="56" y1="56" x2="64" y2="64" /><line x1="64" y1="56" x2="56" y2="64" />
          </g>
          <ellipse cx="50" cy="74" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 44 82 Q 50 90 56 82" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="86" rx={4} ry={3} fill="#ff8fa3" />
        </g>
      </>
    ),
    5: (f) => (
      <>{turbulence(f, 0.07, 15, 3)}
        <g filter={`url(#${f})`} transform="rotate(78 50 64)">
          <circle cx="50" cy="64" r={36} fill="#f4956b" />
          <circle cx="22" cy="54" r={10} fill="#f4956b" /><circle cx="78" cy="54" r={10} fill="#f4956b" />
          <circle cx="20" cy="80" r={9} fill="#f4956b" /><circle cx="80" cy="80" r={9} fill="#f4956b" />
          <circle cx="50" cy="34" r={9} fill="#f4956b" />
          <path d="M 35 28 Q 26 22 24 32 Q 32 34 40 32 Z" fill="#d97a4e" />
          <path d="M 65 28 Q 74 22 76 32 Q 68 34 60 32 Z" fill="#d97a4e" />
          <ellipse cx="50" cy="68" rx="34" ry="22" fill="#ff2d55" opacity={0.4} />
          <circle cx="28" cy="70" r={12} fill="#ff0a3c" opacity={0.85} />
          <circle cx="72" cy="70" r={12} fill="#ff0a3c" opacity={0.85} />
          {drunkFace}
        </g>
        {zzz}
      </>
    ),
  },

  // ─── SHIBA ────────────────────────────────────────────
  shiba: {
    0: (f) => (
      <>{turbulence(f, 0.03, 20, 1.2)}
        <g filter={`url(#${f})`}>
          <path d="M 28 30 L 22 12 L 40 24 Z" fill="#d88a55" />
          <path d="M 72 30 L 78 12 L 60 24 Z" fill="#d88a55" />
          <path d="M 50 28 C 24 28 22 62 26 84 C 30 104 70 104 74 84 C 78 62 76 28 50 28 Z" fill="#d88a55" />
          <ellipse cx="50" cy="72" rx="20" ry="18" fill="#fff5e8" />
          <ellipse cx="50" cy="100" rx="22" ry="6" fill="#fff5e8" />
          <circle cx="40" cy="64" r={3} fill="#2a1a0a" /><circle cx="41" cy="63" r={0.8} fill="#fff" />
          <circle cx="60" cy="64" r={3} fill="#2a1a0a" /><circle cx="61" cy="63" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="74" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 45 80 Q 50 84 55 80" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    1: (f) => (
      <>{turbulence(f, 0.03, 21, 1.3)}
        <g filter={`url(#${f})`}>
          <path d="M 28 30 L 22 12 L 40 24 Z" fill="#d88a55" />
          <path d="M 72 30 L 78 12 L 60 24 Z" fill="#d88a55" />
          <path d="M 50 28 C 24 28 22 62 26 84 C 30 104 70 104 74 84 C 78 62 76 28 50 28 Z" fill="#d88a55" />
          <ellipse cx="50" cy="72" rx="20" ry="18" fill="#fff5e8" />
          <ellipse cx="50" cy="100" rx="22" ry="6" fill="#fff5e8" />
          <circle cx="35" cy="72" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="65" cy="72" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="40" cy="64" r={3} fill="#2a1a0a" /><circle cx="41" cy="63" r={0.8} fill="#fff" />
          <circle cx="60" cy="64" r={3} fill="#2a1a0a" /><circle cx="61" cy="63" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="74" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 45 80 Q 50 84 55 80" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    2: (f) => (
      <>{turbulence(f, 0.035, 22, 1.4)}
        <g filter={`url(#${f})`}>
          <path d="M 28 30 L 22 12 L 40 24 Z" fill="#d88a55" />
          <path d="M 72 30 L 78 12 L 60 24 Z" fill="#d88a55" />
          <path d="M 50 28 C 24 28 22 62 26 84 C 30 104 70 104 74 84 C 78 62 76 28 50 28 Z" fill="#d88a55" />
          <ellipse cx="50" cy="72" rx="20" ry="18" fill="#fff5e8" />
          <ellipse cx="50" cy="100" rx="22" ry="6" fill="#fff5e8" />
          <circle cx="35" cy="72" r={7} fill="#ff8fa3" opacity={0.8} />
          <circle cx="65" cy="72" r={7} fill="#ff8fa3" opacity={0.8} />
          <path d="M 36 64 Q 40 61 44 64" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 64 Q 60 61 64 64" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="74" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 42 80 Q 50 88 58 80" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <rect x="80" y="86" width={10} height={14} fill="#ffd166" stroke="#2a1a0a" strokeWidth={1.2} />
        </g>
      </>
    ),
    3: (f) => (
      <>{turbulence(f, 0.045, 23, 1.8)}
        <g filter={`url(#${f})`}>
          <path d="M 28 32 Q 22 20 26 30 Z" fill="#d88a55" />
          <path d="M 72 30 L 78 12 L 60 24 Z" fill="#d88a55" />
          <path d="M 50 28 C 24 28 22 62 26 84 C 30 104 70 104 74 84 C 78 62 76 28 50 28 Z" fill="#d88a55" />
          <ellipse cx="50" cy="72" rx="20" ry="18" fill="#fff5e8" />
          <ellipse cx="50" cy="100" rx="22" ry="6" fill="#fff5e8" />
          <circle cx="33" cy="74" r={9} fill="#ff5675" opacity={0.85} />
          <circle cx="67" cy="74" r={9} fill="#ff5675" opacity={0.85} />
          <path d="M 36 66 Q 40 70 44 66" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 66 Q 60 70 64 66" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="76" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 44 84 Q 50 80 56 84 Q 53 88 50 86" stroke="#2a1a0a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    4: (f) => (
      <>{turbulence(f, 0.055, 24, 2.3)}
        <g filter={`url(#${f})`}>
          <path d="M 28 34 Q 22 22 26 32 Z" fill="#d88a55" />
          <path d="M 72 34 Q 78 22 74 32 Z" fill="#d88a55" />
          <path d="M 50 28 C 24 28 22 62 26 84 C 30 104 70 104 74 84 C 78 62 76 28 50 28 Z" fill="#d88a55" />
          <ellipse cx="50" cy="72" rx="20" ry="18" fill="#fff5e8" />
          <ellipse cx="50" cy="100" rx="22" ry="6" fill="#fff5e8" />
          <ellipse cx="50" cy="72" rx="22" ry="14" fill="#ff5675" opacity={0.35} />
          <circle cx="32" cy="74" r={11} fill="#ff2d55" opacity={0.9} />
          <circle cx="68" cy="74" r={11} fill="#ff2d55" opacity={0.9} />
          <g stroke="#2a1a0a" strokeWidth={2.2} strokeLinecap="round">
            <line x1="36" y1="60" x2="44" y2="68" /><line x1="44" y1="60" x2="36" y2="68" />
            <line x1="56" y1="60" x2="64" y2="68" /><line x1="64" y1="60" x2="56" y2="68" />
          </g>
          <ellipse cx="50" cy="76" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 44 84 Q 50 92 56 84" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="88" rx={4} ry={3} fill="#ff8fa3" />
        </g>
      </>
    ),
    5: (f) => (
      <>{turbulence(f, 0.065, 25, 2.8)}
        <g filter={`url(#${f})`} transform="rotate(78 50 64)">
          <path d="M 28 34 Q 22 22 26 32 Z" fill="#d88a55" />
          <path d="M 72 34 Q 78 22 74 32 Z" fill="#d88a55" />
          <path d="M 50 28 C 24 28 22 62 26 84 C 30 104 70 104 74 84 C 78 62 76 28 50 28 Z" fill="#d88a55" />
          <ellipse cx="50" cy="72" rx="20" ry="18" fill="#fff5e8" />
          <ellipse cx="50" cy="100" rx="22" ry="6" fill="#fff5e8" />
          <ellipse cx="50" cy="72" rx="24" ry="16" fill="#ff2d55" opacity={0.4} />
          <circle cx="30" cy="74" r={12} fill="#ff0a3c" opacity={0.85} />
          <circle cx="70" cy="74" r={12} fill="#ff0a3c" opacity={0.85} />
          {drunkFace}
        </g>
        {zzz}
      </>
    ),
  },

  // ─── DACHSHUND ────────────────────────────────────────────
  dachshund: {
    0: (f) => (
      <>{turbulence(f, 0.025, 30, 1)}
        <g filter={`url(#${f})`}>
          <ellipse cx="20" cy="65" rx={9} ry={20} fill="#7a5028" />
          <ellipse cx="80" cy="65" rx={9} ry={20} fill="#7a5028" />
          <ellipse cx="50" cy="70" rx={40} ry={28} fill="#8b6240" />
          <rect x="25" y="92" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="42" y="94" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="58" y="94" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="68" y="92" width={8} height={14} rx={3} fill="#7a5028" />
          <circle cx="40" cy="66" r={3} fill="#2a1a0a" /><circle cx="41" cy="65" r={0.8} fill="#fff" />
          <circle cx="60" cy="66" r={3} fill="#2a1a0a" /><circle cx="61" cy="65" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="76" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 46 81 Q 50 84 54 81" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    1: (f) => (
      <>{turbulence(f, 0.025, 31, 1.1)}
        <g filter={`url(#${f})`}>
          <ellipse cx="20" cy="65" rx={9} ry={20} fill="#7a5028" />
          <ellipse cx="80" cy="65" rx={9} ry={20} fill="#7a5028" />
          <ellipse cx="50" cy="70" rx={40} ry={28} fill="#8b6240" />
          <rect x="25" y="92" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="42" y="94" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="58" y="94" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="68" y="92" width={8} height={14} rx={3} fill="#7a5028" />
          <circle cx="34" cy="74" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="66" cy="74" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="40" cy="66" r={3} fill="#2a1a0a" /><circle cx="41" cy="65" r={0.8} fill="#fff" />
          <circle cx="60" cy="66" r={3} fill="#2a1a0a" /><circle cx="61" cy="65" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="76" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 46 81 Q 50 84 54 81" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    2: (f) => (
      <>{turbulence(f, 0.03, 32, 1.3)}
        <g filter={`url(#${f})`}>
          <ellipse cx="20" cy="65" rx={9} ry={20} fill="#7a5028" />
          <ellipse cx="80" cy="65" rx={9} ry={20} fill="#7a5028" />
          <ellipse cx="50" cy="70" rx={40} ry={28} fill="#8b6240" />
          <rect x="25" y="92" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="42" y="94" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="58" y="94" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="68" y="92" width={8} height={14} rx={3} fill="#7a5028" />
          <circle cx="34" cy="74" r={7} fill="#ff8fa3" opacity={0.8} />
          <circle cx="66" cy="74" r={7} fill="#ff8fa3" opacity={0.8} />
          <path d="M 36 64 Q 40 61 44 64" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 64 Q 60 61 64 64" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="76" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 42 82 Q 50 90 58 82" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <rect x="84" y="46" width={10} height={14} fill="#ffd166" stroke="#2a1a0a" strokeWidth={1.2} />
        </g>
      </>
    ),
    3: (f) => (
      <>{turbulence(f, 0.04, 33, 1.7)}
        <g filter={`url(#${f})`}>
          <ellipse cx="20" cy="70" rx={9} ry={22} fill="#7a5028" />
          <ellipse cx="80" cy="68" rx={9} ry={20} fill="#7a5028" />
          <ellipse cx="50" cy="72" rx={40} ry={28} fill="#8b6240" />
          <rect x="25" y="94" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="42" y="96" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="58" y="96" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="68" y="94" width={8} height={14} rx={3} fill="#7a5028" />
          <circle cx="32" cy="76" r={9} fill="#ff5675" opacity={0.85} />
          <circle cx="68" cy="76" r={9} fill="#ff5675" opacity={0.85} />
          <path d="M 36 68 Q 40 72 44 68" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 68 Q 60 72 64 68" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="78" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 44 86 Q 50 82 56 86 Q 53 90 50 88" stroke="#2a1a0a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    4: (f) => (
      <>{turbulence(f, 0.05, 34, 2.2)}
        <g filter={`url(#${f})`}>
          <ellipse cx="20" cy="74" rx={9} ry={22} fill="#7a5028" />
          <ellipse cx="80" cy="74" rx={9} ry={22} fill="#7a5028" />
          <ellipse cx="50" cy="74" rx={40} ry={28} fill="#8b6240" />
          <rect x="25" y="96" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="42" y="98" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="58" y="98" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="68" y="96" width={8} height={14} rx={3} fill="#7a5028" />
          <ellipse cx="50" cy="74" rx={36} ry={22} fill="#ff5675" opacity={0.3} />
          <circle cx="30" cy="76" r={11} fill="#ff2d55" opacity={0.85} />
          <circle cx="70" cy="76" r={11} fill="#ff2d55" opacity={0.85} />
          <g stroke="#2a1a0a" strokeWidth={2.2} strokeLinecap="round">
            <line x1="36" y1="62" x2="44" y2="70" /><line x1="44" y1="62" x2="36" y2="70" />
            <line x1="56" y1="62" x2="64" y2="70" /><line x1="64" y1="62" x2="56" y2="70" />
          </g>
          <ellipse cx="50" cy="78" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 44 86 Q 50 94 56 86" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="90" rx={4} ry={3} fill="#ff8fa3" />
        </g>
      </>
    ),
    5: (f) => (
      <>{turbulence(f, 0.06, 35, 2.7)}
        <g filter={`url(#${f})`} transform="rotate(85 50 70)">
          <ellipse cx="20" cy="74" rx={9} ry={22} fill="#7a5028" />
          <ellipse cx="80" cy="74" rx={9} ry={22} fill="#7a5028" />
          <ellipse cx="50" cy="74" rx={40} ry={28} fill="#8b6240" />
          <rect x="25" y="96" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="42" y="98" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="58" y="98" width={8} height={14} rx={3} fill="#7a5028" />
          <rect x="68" y="96" width={8} height={14} rx={3} fill="#7a5028" />
          <ellipse cx="50" cy="74" rx={38} ry={24} fill="#ff2d55" opacity={0.4} />
          <circle cx="28" cy="76" r={12} fill="#ff0a3c" opacity={0.85} />
          <circle cx="72" cy="76" r={12} fill="#ff0a3c" opacity={0.85} />
          <g fill="none" stroke="#2a1a0a" strokeWidth={1.8} strokeLinecap="round">
            <path d="M 36 64 Q 42 60 44 66 Q 42 70 38 68" />
            <path d="M 56 64 Q 62 60 64 66 Q 62 70 58 68" />
          </g>
          <ellipse cx="50" cy="78" rx={3} ry={2} fill="#2a1a0a" />
          <ellipse cx="50" cy="88" rx={5} ry={4} fill="#2a1a0a" />
          <ellipse cx="50" cy="89" rx={3.5} ry={2.5} fill="#ff5675" />
        </g>
        {zzz}
      </>
    ),
  },

  // ─── POODLE ────────────────────────────────────────────
  poodle: {
    0: (f) => (
      <>{turbulence(f, 0.05, 40, 1.8)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={34} fill="#fff5e8" />
          <circle cx="22" cy="46" r={10} fill="#fff5e8" /><circle cx="78" cy="46" r={10} fill="#fff5e8" />
          <circle cx="50" cy="28" r={14} fill="#fff5e8" />
          <circle cx="34" cy="32" r={8} fill="#fff5e8" /><circle cx="66" cy="32" r={8} fill="#fff5e8" />
          <circle cx="24" cy="86" r={10} fill="#fff5e8" /><circle cx="76" cy="86" r={10} fill="#fff5e8" />
          <circle cx="40" cy="40" r={2} fill="#e8dcc4" opacity={0.6} />
          <circle cx="64" cy="50" r={2} fill="#e8dcc4" opacity={0.6} />
          <circle cx="32" cy="72" r={2} fill="#e8dcc4" opacity={0.6} />
          <circle cx="68" cy="78" r={2} fill="#e8dcc4" opacity={0.6} />
          <circle cx="40" cy="58" r={3} fill="#2a1a0a" /><circle cx="41" cy="57" r={0.8} fill="#fff" />
          <circle cx="60" cy="58" r={3} fill="#2a1a0a" /><circle cx="61" cy="57" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="68" rx={2.5} ry={1.8} fill="#2a1a0a" />
          <path d="M 46 73 Q 50 76 54 73" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    1: (f) => (
      <>{turbulence(f, 0.05, 41, 1.8)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={34} fill="#fff5e8" />
          <circle cx="22" cy="46" r={10} fill="#fff5e8" /><circle cx="78" cy="46" r={10} fill="#fff5e8" />
          <circle cx="50" cy="28" r={14} fill="#fff5e8" />
          <circle cx="34" cy="32" r={8} fill="#fff5e8" /><circle cx="66" cy="32" r={8} fill="#fff5e8" />
          <circle cx="24" cy="86" r={10} fill="#fff5e8" /><circle cx="76" cy="86" r={10} fill="#fff5e8" />
          <circle cx="35" cy="66" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="65" cy="66" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="40" cy="58" r={3} fill="#2a1a0a" /><circle cx="41" cy="57" r={0.8} fill="#fff" />
          <circle cx="60" cy="58" r={3} fill="#2a1a0a" /><circle cx="61" cy="57" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="68" rx={2.5} ry={1.8} fill="#2a1a0a" />
          <path d="M 46 73 Q 50 76 54 73" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    2: (f) => (
      <>{turbulence(f, 0.055, 42, 1.9)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={34} fill="#fff5e8" />
          <circle cx="22" cy="46" r={10} fill="#fff5e8" /><circle cx="78" cy="46" r={10} fill="#fff5e8" />
          <circle cx="50" cy="28" r={14} fill="#fff5e8" />
          <circle cx="34" cy="32" r={8} fill="#fff5e8" /><circle cx="66" cy="32" r={8} fill="#fff5e8" />
          <circle cx="24" cy="86" r={10} fill="#fff5e8" /><circle cx="76" cy="86" r={10} fill="#fff5e8" />
          <circle cx="35" cy="66" r={7} fill="#ff8fa3" opacity={0.8} />
          <circle cx="65" cy="66" r={7} fill="#ff8fa3" opacity={0.8} />
          <path d="M 36 58 Q 40 55 44 58" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 58 Q 60 55 64 58" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="68" rx={2.5} ry={1.8} fill="#2a1a0a" />
          <path d="M 42 74 Q 50 82 58 74" stroke="#2a1a0a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <rect x="82" y="82" width={10} height={14} fill="#ffd166" stroke="#2a1a0a" strokeWidth={1.2} />
        </g>
      </>
    ),
    3: (f) => (
      <>{turbulence(f, 0.06, 43, 2.2)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={34} fill="#fff5e8" />
          <circle cx="22" cy="48" r={10} fill="#fff5e8" /><circle cx="78" cy="48" r={10} fill="#fff5e8" />
          <circle cx="50" cy="28" r={14} fill="#fff5e8" />
          <circle cx="34" cy="32" r={8} fill="#fff5e8" /><circle cx="66" cy="32" r={8} fill="#fff5e8" />
          <circle cx="24" cy="86" r={10} fill="#fff5e8" /><circle cx="76" cy="86" r={10} fill="#fff5e8" />
          <circle cx="33" cy="68" r={9} fill="#ff5675" opacity={0.85} />
          <circle cx="67" cy="68" r={9} fill="#ff5675" opacity={0.85} />
          <path d="M 36 60 Q 40 64 44 60" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 60 Q 60 64 64 60" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="70" rx={2.5} ry={1.8} fill="#2a1a0a" />
          <path d="M 44 78 Q 50 74 56 78 Q 53 82 50 80" stroke="#2a1a0a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    4: (f) => (
      <>{turbulence(f, 0.07, 44, 2.5)}
        <g filter={`url(#${f})`}>
          <circle cx="50" cy="64" r={34} fill="#fff5e8" />
          <circle cx="22" cy="50" r={10} fill="#fff5e8" /><circle cx="78" cy="50" r={10} fill="#fff5e8" />
          <circle cx="50" cy="30" r={14} fill="#fff5e8" />
          <circle cx="34" cy="34" r={8} fill="#fff5e8" /><circle cx="66" cy="34" r={8} fill="#fff5e8" />
          <circle cx="24" cy="88" r={10} fill="#fff5e8" /><circle cx="76" cy="88" r={10} fill="#fff5e8" />
          <ellipse cx="50" cy="68" rx={30} ry={18} fill="#ff5675" opacity={0.3} />
          <circle cx="30" cy="70" r={11} fill="#ff2d55" opacity={0.85} />
          <circle cx="70" cy="70" r={11} fill="#ff2d55" opacity={0.85} />
          <g stroke="#2a1a0a" strokeWidth={2.2} strokeLinecap="round">
            <line x1="36" y1="54" x2="44" y2="62" /><line x1="44" y1="54" x2="36" y2="62" />
            <line x1="56" y1="54" x2="64" y2="62" /><line x1="64" y1="54" x2="56" y2="62" />
          </g>
          <ellipse cx="50" cy="72" rx={3} ry={2} fill="#2a1a0a" />
          <path d="M 44 80 Q 50 88 56 80" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="84" rx={4} ry={3} fill="#ff8fa3" />
        </g>
      </>
    ),
    5: (f) => (
      <>{turbulence(f, 0.08, 45, 3)}
        <g filter={`url(#${f})`} transform="rotate(78 50 64)">
          <circle cx="50" cy="64" r={34} fill="#fff5e8" />
          <circle cx="22" cy="50" r={10} fill="#fff5e8" /><circle cx="78" cy="50" r={10} fill="#fff5e8" />
          <circle cx="50" cy="30" r={14} fill="#fff5e8" />
          <circle cx="34" cy="34" r={8} fill="#fff5e8" /><circle cx="66" cy="34" r={8} fill="#fff5e8" />
          <circle cx="24" cy="88" r={10} fill="#fff5e8" /><circle cx="76" cy="88" r={10} fill="#fff5e8" />
          <ellipse cx="50" cy="68" rx={32} ry={20} fill="#ff2d55" opacity={0.4} />
          <circle cx="28" cy="70" r={12} fill="#ff0a3c" opacity={0.85} />
          <circle cx="72" cy="70" r={12} fill="#ff0a3c" opacity={0.85} />
          {drunkFace}
        </g>
        {zzz}
      </>
    ),
  },

  // ─── BULLDOG ────────────────────────────────────────────
  bulldog: {
    0: (f) => (
      <>{turbulence(f, 0.03, 50, 1.2)}
        <g filter={`url(#${f})`}>
          <path d="M 22 35 Q 14 28 18 48 Q 24 44 28 42" fill="#9a8870" />
          <path d="M 78 35 Q 86 28 82 48 Q 76 44 72 42" fill="#9a8870" />
          <path d="M 50 28 C 14 28 12 70 16 88 C 22 108 78 108 84 88 C 88 70 86 28 50 28 Z" fill="#b8a890" />
          <path d="M 30 56 Q 50 62 70 56" stroke="#7a6850" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.5} />
          <path d="M 32 70 Q 50 75 68 70" stroke="#7a6850" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.5} />
          <circle cx="40" cy="48" r={3} fill="#2a1a0a" /><circle cx="41" cy="47" r={0.8} fill="#fff" />
          <circle cx="60" cy="48" r={3} fill="#2a1a0a" /><circle cx="61" cy="47" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="62" rx={6} ry={4} fill="#2a1a0a" />
          <path d="M 38 78 Q 50 88 62 78" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 38 78 Q 36 86 34 88" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
          <path d="M 62 78 Q 64 86 66 88" stroke="#2a1a0a" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    1: (f) => (
      <>{turbulence(f, 0.03, 51, 1.3)}
        <g filter={`url(#${f})`}>
          <path d="M 22 35 Q 14 28 18 48 Q 24 44 28 42" fill="#9a8870" />
          <path d="M 78 35 Q 86 28 82 48 Q 76 44 72 42" fill="#9a8870" />
          <path d="M 50 28 C 14 28 12 70 16 88 C 22 108 78 108 84 88 C 88 70 86 28 50 28 Z" fill="#b8a890" />
          <path d="M 30 56 Q 50 62 70 56" stroke="#7a6850" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.5} />
          <path d="M 32 70 Q 50 75 68 70" stroke="#7a6850" strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.5} />
          <circle cx="32" cy="58" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="68" cy="58" r={6} fill="#ffb3c1" opacity={0.7} />
          <circle cx="40" cy="48" r={3} fill="#2a1a0a" /><circle cx="41" cy="47" r={0.8} fill="#fff" />
          <circle cx="60" cy="48" r={3} fill="#2a1a0a" /><circle cx="61" cy="47" r={0.8} fill="#fff" />
          <ellipse cx="50" cy="62" rx={6} ry={4} fill="#2a1a0a" />
          <path d="M 38 78 Q 50 88 62 78" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    2: (f) => (
      <>{turbulence(f, 0.035, 52, 1.4)}
        <g filter={`url(#${f})`}>
          <path d="M 22 35 Q 14 28 18 48 Q 24 44 28 42" fill="#9a8870" />
          <path d="M 78 35 Q 86 28 82 48 Q 76 44 72 42" fill="#9a8870" />
          <path d="M 50 28 C 14 28 12 70 16 88 C 22 108 78 108 84 88 C 88 70 86 28 50 28 Z" fill="#b8a890" />
          <circle cx="32" cy="58" r={7} fill="#ff8fa3" opacity={0.8} />
          <circle cx="68" cy="58" r={7} fill="#ff8fa3" opacity={0.8} />
          <path d="M 36 46 Q 40 43 44 46" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 46 Q 60 43 64 46" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="62" rx={6} ry={4} fill="#2a1a0a" />
          <path d="M 36 78 Q 50 92 64 78" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <rect x="84" y="84" width={10} height={14} fill="#ffd166" stroke="#2a1a0a" strokeWidth={1.2} />
        </g>
      </>
    ),
    3: (f) => (
      <>{turbulence(f, 0.045, 53, 1.8)}
        <g filter={`url(#${f})`}>
          <path d="M 22 38 Q 14 30 18 50 Q 24 46 28 44" fill="#9a8870" />
          <path d="M 78 35 Q 86 28 82 48 Q 76 44 72 42" fill="#9a8870" />
          <path d="M 50 28 C 14 28 12 70 16 88 C 22 108 78 108 84 88 C 88 70 86 28 50 28 Z" fill="#b8a890" />
          <circle cx="30" cy="60" r={10} fill="#ff5675" opacity={0.85} />
          <circle cx="70" cy="60" r={10} fill="#ff5675" opacity={0.85} />
          <path d="M 36 50 Q 40 54 44 50" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M 56 50 Q 60 54 64 50" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="64" rx={6} ry={4} fill="#2a1a0a" />
          <path d="M 40 80 Q 50 76 60 80 Q 55 84 50 82" stroke="#2a1a0a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </g>
      </>
    ),
    4: (f) => (
      <>{turbulence(f, 0.055, 54, 2.3)}
        <g filter={`url(#${f})`}>
          <path d="M 22 40 Q 14 32 18 52 Q 24 48 28 46" fill="#9a8870" />
          <path d="M 78 40 Q 86 32 82 52 Q 76 48 72 46" fill="#9a8870" />
          <path d="M 50 28 C 14 28 12 70 16 88 C 22 108 78 108 84 88 C 88 70 86 28 50 28 Z" fill="#b8a890" />
          <ellipse cx="50" cy="62" rx={36} ry={18} fill="#ff5675" opacity={0.3} />
          <circle cx="28" cy="60" r={12} fill="#ff2d55" opacity={0.85} />
          <circle cx="72" cy="60" r={12} fill="#ff2d55" opacity={0.85} />
          <g stroke="#2a1a0a" strokeWidth={2.2} strokeLinecap="round">
            <line x1="36" y1="44" x2="44" y2="52" /><line x1="44" y1="44" x2="36" y2="52" />
            <line x1="56" y1="44" x2="64" y2="52" /><line x1="64" y1="44" x2="56" y2="52" />
          </g>
          <ellipse cx="50" cy="64" rx={6} ry={4} fill="#2a1a0a" />
          <path d="M 38 80 Q 50 90 62 80" stroke="#2a1a0a" strokeWidth={2} fill="none" strokeLinecap="round" />
          <ellipse cx="50" cy="86" rx={5} ry={4} fill="#ff8fa3" />
        </g>
      </>
    ),
    5: (f) => (
      <>{turbulence(f, 0.065, 55, 2.7)}
        <g filter={`url(#${f})`} transform="rotate(82 50 64)">
          <path d="M 22 40 Q 14 32 18 52 Q 24 48 28 46" fill="#9a8870" />
          <path d="M 78 40 Q 86 32 82 52 Q 76 48 72 46" fill="#9a8870" />
          <path d="M 50 28 C 14 28 12 70 16 88 C 22 108 78 108 84 88 C 88 70 86 28 50 28 Z" fill="#b8a890" />
          <ellipse cx="50" cy="62" rx={38} ry={22} fill="#ff2d55" opacity={0.4} />
          <circle cx="26" cy="60" r={13} fill="#ff0a3c" opacity={0.85} />
          <circle cx="74" cy="60" r={13} fill="#ff0a3c" opacity={0.85} />
          <g fill="none" stroke="#2a1a0a" strokeWidth={1.8} strokeLinecap="round">
            <path d="M 36 46 Q 42 42 44 48 Q 42 52 38 50" />
            <path d="M 56 46 Q 62 42 64 48 Q 62 52 58 50" />
          </g>
          <ellipse cx="50" cy="64" rx={6} ry={4} fill="#2a1a0a" />
          <ellipse cx="50" cy="78" rx={6} ry={4} fill="#2a1a0a" />
          <ellipse cx="50" cy="79" rx={4} ry={2.5} fill="#ff5675" />
        </g>
        {zzz}
      </>
    ),
  },
};

// Default export + 이름 alias
export default Character;
export const breedNames = Object.fromEntries(
  Object.entries(BREEDS).map(([k, v]) => [k, v.name])
) as Record<Breed, string>;
