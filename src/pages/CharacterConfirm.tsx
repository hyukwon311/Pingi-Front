/**
 * @file CharacterConfirm.tsx - 캐릭터 확인 페이지
 *
 * 술자리 시작 전, 모든 참여 멤버의 캐릭터와 닉네임을 한눈에 확인하는 화면이다.
 * 각 멤버의 선택한 캐릭터(견종)가 LV0 상태로 표시되며,
 * 이를 통해 술자리 동안 함께할 친구들을 파악할 수 있다.
 * "베이스라인 측정하러 가기" 버튼을 누르면 발음 테스트 화면으로 이동하여
 * 술 마시기 전 기준 음성을 녹음하게 된다.
 */
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character, { breedNames } from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'

interface MemberInfo {
  memberId: string
  nickname: string
  breed: CharacterBreed
}

export default function CharacterConfirm() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()

  // TODO: API에서 멤버 목록 받기
  const members: MemberInfo[] = [
    { memberId: '1', nickname: '민준', breed: 'retriever' },
    { memberId: '2', nickname: '수진', breed: 'pomeranian' },
    { memberId: '3', nickname: '지훈', breed: 'shiba' },
    { memberId: '4', nickname: '수아', breed: 'poodle' },
  ]

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-2xl text-brown-900">
            오늘의 멤버
          </h1>
        </div>

        <Card className="mt-6">
          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <div key={m.memberId} className="flex items-center gap-3">
                <Character breed={m.breed} level={0} size="xs" showBadge={false} showEffects={false} />
                <div>
                  <p className="font-display text-sm text-brown-900">
                    {m.nickname}
                  </p>
                  <p className="text-[10px] text-brown-400">
                    ({breedNames[m.breed]})
                  </p>
                </div>
              </div>
            ))}
          </div>
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
