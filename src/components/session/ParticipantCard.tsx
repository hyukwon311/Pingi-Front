/**
 * @file ParticipantCard.tsx - 참가자 정보 카드
 *
 * 세션 대시보드에서 각 참가자의 정보(닉네임, 취도, 음주량, 취도 변화 그래프)를 표시한다.
 * 본인(isMe=true)인 경우 음주량 +/- 카운터가 노출되고,
 * 다른 사람인 경우 잔 수만 텍스트로 표시된다.
 *
 * @param participant - 참가자 데이터
 * @param isMe - 현재 로그인한 사용자 본인 여부
 * @param onDrinkIncrement - 잔 수 증가 콜백 (본인일 때만 사용)
 * @param onDrinkDecrement - 잔 수 감소 콜백 (본인일 때만 사용)
 */
import Card from '@/components/common/Card'
import DrunkLevelBadge from './DrunkLevelBadge'
import DrinkCounter from './DrinkCounter'
import type { Participant } from '@/types/session'

interface ParticipantCardProps {
  participant: Participant
  isMe: boolean
  onDrinkIncrement?: () => void
  onDrinkDecrement?: () => void
}

export default function ParticipantCard({
  participant,
  isMe,
  onDrinkIncrement,
  onDrinkDecrement,
}: ParticipantCardProps) {
  const { user, drunkLevel, drinkCount, levelHistory } = participant

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-pingi-50 flex items-center justify-center text-[15px] font-bold text-pingi-600">
            {user.nickname.charAt(0)}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-grey-900 leading-tight">
              {user.nickname}
              {isMe && <span className="ml-1.5 text-[12px] text-pingi-500 font-medium">(나)</span>}
            </p>
          </div>
        </div>
        <DrunkLevelBadge level={drunkLevel} size="sm" />
      </div>

      {levelHistory.length > 1 && (
        <div className="h-12 flex items-end gap-1 px-1">
          {levelHistory.map((entry, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-pingi-200/60"
              style={{ height: `${(entry.level / 5) * 100}%` }}
            />
          ))}
        </div>
      )}

      {isMe && onDrinkIncrement && onDrinkDecrement && (
        <div className="flex items-center justify-between pt-3 border-t border-grey-200">
          <span className="text-[14px] text-grey-500">마신 잔 수</span>
          <DrinkCounter
            count={drinkCount}
            onIncrement={onDrinkIncrement}
            onDecrement={onDrinkDecrement}
          />
        </div>
      )}

      {!isMe && (
        <div className="flex items-center justify-between pt-3 border-t border-grey-200">
          <span className="text-[14px] text-grey-500">마신 잔 수</span>
          <span className="font-bold text-[15px] text-grey-900">{drinkCount}잔</span>
        </div>
      )}
    </Card>
  )
}
