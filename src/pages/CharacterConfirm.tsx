/**
 * @file CharacterConfirm.tsx - 캐릭터 확인 페이지
 *
 * 술자리 시작 전, 모든 참여 멤버의 캐릭터와 닉네임을 한눈에 확인하는 화면이다.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character, { breedNames } from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'
import { getRoom } from '@/services/api'

interface MemberInfo {
  memberId: string
  nickname: string
  breed: CharacterBreed
  isHost: boolean
}

export default function CharacterConfirm() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMembers() {
      if (!code) return
      try {
        const room = await getRoom(code)
        setMembers(room.members.map(m => ({
          memberId: m.id,
          nickname: m.nickname,
          breed: (m.breed || 'retriever') as CharacterBreed,
          isHost: m.isHost,
        })))
      } catch (error) {
        console.error('Failed to fetch members:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [code])

  if (loading) {
    return (
      <PageTransition>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-brown-500">로딩 중...</p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-2xl text-brown-900">
            오늘의 멤버
          </h1>
        </div>

        <Card className="mt-6">
          {members.length === 0 ? (
            <p className="text-center text-brown-500 py-4">멤버가 없어요</p>
          ) : (
            <div className="flex flex-col gap-3">
              {members.map((m) => (
                <div key={m.memberId} className="flex items-center gap-3">
                  <Character breed={m.breed} level={0} size="xs" showBadge={false} showEffects={false} />
                  <div>
                    <p className="font-display text-sm text-brown-900">
                      {m.nickname}
                      {m.isHost && ' 👑'}
                    </p>
                    <p className="text-[10px] text-brown-400">
                      ({breedNames[m.breed]})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="mt-4 text-center">
          <p className="text-sm text-brown-900">
            이제 베이스라인 음성을 녹음할게요.
          </p>
          <p className="text-xs text-brown-500 mt-1">
            조용한 곳에서 진행해주세요.
          </p>
        </Card>

        <div className="mt-auto pt-6">
          <Button onClick={() => navigate(`/r/${code}/baseline`)}>
            녹음 시작
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
