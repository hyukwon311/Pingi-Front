/**
 * @file SessionResult.tsx - 세션 결과 페이지
 *
 * 술자리 종료 후 결과를 확인하는 화면으로, 다음을 포함한다:
 * - MVP 카드: "술잔 왕" (가장 많이 마신 사람), "철벽 간" (가장 안 취한 사람)
 * - 참가자별 상세 결과: 취도 레벨, 발음 변화율, 취도 변화 그래프, 총 잔 수
 * - "결과 공유하기" 및 "홈으로 돌아가기" 버튼
 */
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import DrunkLevelBadge from '@/components/session/DrunkLevelBadge'
import PageTransition from '@/components/layout/PageTransition'

interface ResultParticipant {
  nickname: string
  level: number
  drinkCount: number
  changeRate: number
  levelHistory: number[]
}

/** TODO: API 연동 후 제거할 더미 결과 데이터 */
const mockResults: ResultParticipant[] = [
  { nickname: '나', level: 2, drinkCount: 4, changeRate: 0.18, levelHistory: [1, 1, 2, 2] },
  { nickname: '친구1', level: 4, drinkCount: 8, changeRate: 0.55, levelHistory: [1, 2, 3, 4] },
  { nickname: '친구2', level: 3, drinkCount: 5, changeRate: 0.38, levelHistory: [1, 1, 2, 3] },
]

/** 결과에서 MVP(술잔 왕, 철벽 간)를 선정한다 */
function getMvp(results: ResultParticipant[]) {
  const mostDrinks = [...results].sort((a, b) => b.drinkCount - a.drinkCount)[0]
  const mostSober = [...results].sort((a, b) => a.level - b.level)[0]
  return { mostDrinks, mostSober }
}

export default function SessionResult() {
  const navigate = useNavigate()
  const { mostDrinks, mostSober } = getMvp(mockResults)

  return (
    <PageTransition>
      <Header title="술자리 결과" showBack />
      <div className="flex-1 px-5 py-6 flex flex-col gap-5">
        <div className="text-center pt-2">
          <h2 className="text-[22px] font-bold text-grey-900">오늘의 술자리 결과</h2>
          <p className="text-[14px] text-grey-500 mt-2">2시간 30분 · 3명 참가</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card padding="lg" className="text-center bg-[#FFF8E1]">
            <p className="text-[12px] text-status-warning font-semibold mb-1.5">술잔 왕</p>
            <p className="text-[17px] font-bold text-grey-900">{mostDrinks.nickname}</p>
            <p className="text-[14px] text-status-warning mt-1">{mostDrinks.drinkCount}잔</p>
          </Card>
          <Card padding="lg" className="text-center bg-[#E8F5E9]">
            <p className="text-[12px] text-status-success font-semibold mb-1.5">철벽 간</p>
            <p className="text-[17px] font-bold text-grey-900">{mostSober.nickname}</p>
            <p className="text-[14px] text-status-success mt-1">Lv.{mostSober.level}</p>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          {mockResults.map((r) => (
            <Card key={r.nickname} padding="lg" className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-pingi-50 flex items-center justify-center text-[15px] font-bold text-pingi-600">
                    {r.nickname.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-grey-900">{r.nickname}</p>
                    <p className="text-[12px] text-grey-500 mt-0.5">
                      발음 변화율 {Math.round(r.changeRate * 100)}%
                    </p>
                  </div>
                </div>
                <DrunkLevelBadge level={r.level} />
              </div>

              <div className="h-10 flex items-end gap-1.5 px-1">
                {r.levelHistory.map((lv, i) => {
                  const colorMap: Record<number, string> = {
                    1: 'bg-drunk-1',
                    2: 'bg-drunk-2',
                    3: 'bg-drunk-3',
                    4: 'bg-drunk-4',
                    5: 'bg-drunk-5',
                  }
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-md ${colorMap[lv] ?? 'bg-grey-200'}`}
                      style={{ height: `${(lv / 5) * 100}%` }}
                    />
                  )
                })}
              </div>

              <div className="flex items-center justify-between text-[13px] text-grey-500 pt-3 border-t border-grey-200">
                <span>총 {r.drinkCount}잔</span>
                <span>최종 Lv.{r.level}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="pb-6 flex flex-col gap-3 mt-2">
          <Button fullWidth size="lg" variant="secondary">
            결과 공유하기
          </Button>
          <Button fullWidth size="lg" onClick={() => navigate('/home')}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
