import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import PageTransition from '@/components/layout/PageTransition'
import Card from '@/components/common/Card'

const stats = [
  { label: '총 참여', value: '12회' },
  { label: '평균 취도', value: 'Lv.2' },
  { label: '최다 참가 세션', value: '금요 회식' },
]

export default function MyPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <PageTransition>
      <Header variant="home" title="마이" />
      <div className="flex flex-col gap-3 px-5 pb-6">
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-pingi-50 flex items-center justify-center text-[20px] font-bold text-pingi-600">
              {user?.nickname.charAt(0)}
            </div>
            <div>
              <p className="text-[18px] font-bold text-grey-900">{user?.nickname}</p>
              <p className="text-[13px] text-grey-500 mt-0.5">핑이 회원</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-[15px] font-bold text-grey-900 mb-4">나의 통계</p>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center py-3 rounded-xl bg-grey-50">
                <p className="text-[16px] font-bold text-grey-900">{stat.value}</p>
                <p className="text-[12px] text-grey-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-col divide-y divide-grey-100">
            <button
              onClick={() => navigate('/history')}
              className="flex items-center justify-between py-4 text-left active:opacity-60 transition-opacity"
            >
              <span className="text-[15px] text-grey-900">세션 기록</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="var(--color-grey-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="flex items-center justify-between py-4 text-left active:opacity-60 transition-opacity">
              <span className="text-[15px] text-grey-900">알림 설정</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="var(--color-grey-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="flex items-center justify-between py-4 text-left active:opacity-60 transition-opacity">
              <span className="text-[15px] text-grey-900">앱 정보</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="var(--color-grey-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </Card>

        <button
          onClick={handleLogout}
          className="mt-2 py-4 text-[14px] text-grey-500 active:text-grey-700 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </PageTransition>
  )
}
