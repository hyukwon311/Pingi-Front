/**
 * @file ArrivalInfo.tsx - 도착 정보 입력 페이지
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import PageTransition from '@/components/layout/PageTransition'
import type { HungerLevel } from '@/types/room'
import { updateMember, getCurrentMemberId } from '@/services/api'

interface HungerOption {
  value: HungerLevel
  apiValue: number
  label: string
  warning?: boolean
}

const hungerOptions: HungerOption[] = [
  { value: 'full', apiValue: 0, label: '방금 먹음 (배 부름)' },
  { value: 'little', apiValue: 1, label: '좀 출출함' },
  { value: 'hungry', apiValue: 2, label: '배고픔' },
  { value: 'starving', apiValue: 3, label: '종일 굶음 ⚠', warning: true },
]

function getDefaultTime() {
  const now = new Date()
  now.setHours(19, 30, 0, 0)
  return now.toTimeString().slice(0, 5)
}

export default function ArrivalInfo() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [arrivalTime, setArrivalTime] = useState(getDefaultTime())
  const [hunger, setHunger] = useState<HungerLevel | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!hunger) return
    
    setSaving(true)
    try {
      const memberId = getCurrentMemberId()
      if (memberId) {
        const hungerOption = hungerOptions.find(h => h.value === hunger)
        await updateMember(memberId, { 
          hungerLevel: hungerOption?.apiValue ?? 0,
        })
      }
      navigate(`/r/${code}/lobby`)
    } catch (error) {
      console.error('Failed to save arrival info:', error)
      navigate(`/r/${code}/lobby`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-2xl text-brown-900">
            도착 예정 시간
          </h1>
          <p className="text-sm text-brown-500 mt-1">
            약속 19:30 · 늦으면 알려줄게요
          </p>
        </div>

        <Card className="mt-6">
          <label className="block text-xs font-semibold text-brown-500 mb-2">
            도착 예정 시간
          </label>
          <input
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border-[1.5px] border-brown-300 rounded-[10px] text-sm text-brown-900 focus:outline-none focus:border-ink transition-colors"
          />
        </Card>

        <Card className="mt-4">
          <label className="block text-xs font-semibold text-brown-500 mb-3">
            지금 배고픔 정도
          </label>
          <div className="flex flex-col gap-2">
            {hungerOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setHunger(opt.value)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                  ${hunger === opt.value
                    ? 'bg-highlight/20 border-2 border-highlight'
                    : 'bg-white border-2 border-brown-300'
                  }
                `}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${hunger === opt.value ? 'border-ink' : 'border-brown-300'}
                  `}
                >
                  {hunger === opt.value && (
                    <span className="w-2.5 h-2.5 rounded-full bg-ink" />
                  )}
                </span>
                <span className={`text-sm ${opt.warning ? 'text-warning font-bold' : 'text-brown-900'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-brown-400 mt-3 text-center">
            ※ 공복으로 마시면 빨리 취해요
          </p>
        </Card>

        <div className="mt-auto pt-6">
          <Button onClick={handleSubmit} disabled={!hunger || saving}>
            {saving ? '저장 중...' : '준비 완료'}
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
