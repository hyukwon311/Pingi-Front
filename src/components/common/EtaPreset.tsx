/**
 * @file EtaPreset.tsx - 도착 예정 시간 프리셋 버튼
 *
 * 정시, 5분, 10분, 많이 지각 선택 버튼 그룹.
 */

type Preset = 'ontime' | 'late5' | 'late10' | 'late20'

const presets: { key: Preset; label: string; color: string; bg: string }[] = [
  { key: 'ontime', label: '🟢 정시', color: 'text-success border-success', bg: 'bg-success/10' },
  { key: 'late5', label: '🟡 5분', color: 'text-brown-500 border-highlight', bg: 'bg-highlight/10' },
  { key: 'late10', label: '🟠 10분', color: 'text-warning border-warning', bg: 'bg-warning/10' },
  { key: 'late20', label: '🔴 많이', color: 'text-ink border-ink', bg: 'bg-ink/10' },
]

interface EtaPresetProps {
  selected?: Preset
  onSelect: (preset: Preset) => void
}

export default function EtaPreset({ selected, onSelect }: EtaPresetProps) {
  return (
    <div>
      <div className="text-[10px] text-brown-500 mb-1.5">내 상태 업데이트:</div>
      <div className="flex gap-1">
        {presets.map(({ key, label, color, bg }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`flex-1 py-2 rounded-lg border-[1.5px] text-[11px] font-bold transition-all ${color} ${
              selected === key ? bg : 'bg-transparent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export type { Preset as EtaPresetType }
