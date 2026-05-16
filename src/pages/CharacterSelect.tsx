/**
 * @file CharacterSelect.tsx - 캐릭터 선택 페이지
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoom } from '@/contexts/RoomContext'
import Button from '@/components/common/Button'
import Character, { breedNames } from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'
import { updateMember, getCurrentMemberId } from '@/services/api'

interface CharacterOption {
  breed: CharacterBreed
  name: string
  description: string
}

const characters: CharacterOption[] = [
  { breed: 'retriever', name: '덕배', description: '처진 귀 · 노란 털' },
  { breed: 'pomeranian', name: '뽀삐', description: '솜뭉치 · 뾰족 귀' },
  { breed: 'shiba', name: '콩이', description: '삼각 귀 · 흰 마스크' },
  { breed: 'dachshund', name: '곰자', description: '긴 몸 · 짧은 다리' },
  { breed: 'poodle', name: '눈송이', description: '곱슬 · 흰 털' },
  { breed: 'bulldog', name: '멍구', description: '주름 · 처진 입꼬리' },
]

export default function CharacterSelect() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { setCharacter } = useRoom()
  const [selected, setSelected] = useState<CharacterBreed | null>(null)
  const [saving, setSaving] = useState(false)

  const handleNext = async () => {
    if (!selected) return
    
    setSaving(true)
    try {
      const memberId = getCurrentMemberId()
      if (memberId) {
        await updateMember(memberId, { breed: selected })
      }
      setCharacter(selected)
      navigate(`/r/${code}/arrival`)
    } catch (error) {
      console.error('Failed to save character:', error)
      // 에러가 나도 일단 진행
      setCharacter(selected)
      navigate(`/r/${code}/arrival`)
    } finally {
      setSaving(false)
    }
  }

  const selectedChar = characters.find((c) => c.breed === selected)

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-2xl text-brown-900">
            내 캐릭터 선택
          </h1>
          <p className="text-sm text-brown-500 mt-1">
            술자리에서 같이 놀 친구를 골라줘 🐾
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {characters.map((char) => (
            <button
              key={char.breed}
              onClick={() => setSelected(char.breed)}
              className={`
                flex flex-col items-center p-3 rounded-2xl bg-white shadow-card transition-all
                ${selected === char.breed ? 'border-2 border-highlight scale-105' : 'border-2 border-transparent'}
              `}
            >
              <Character breed={char.breed} level={0} size="sm" showBadge={false} showEffects={false} />
              <p className="font-display text-sm text-brown-900 mt-2">
                {char.name}
              </p>
              <p className="text-[10px] text-brown-400 mt-0.5">
                {char.description}
              </p>
            </button>
          ))}
        </div>

        {selectedChar && (
          <div className="text-center mt-6 text-sm text-brown-500">
            선택됨: <span className="font-bold text-brown-900">{selectedChar.name}</span>
          </div>
        )}

        <div className="mt-auto pt-6">
          <Button onClick={handleNext} disabled={!selected || saving}>
            {saving ? '저장 중...' : '다음'}
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
