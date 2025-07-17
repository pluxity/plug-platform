import { Profile } from '@plug/ui'

const BackofficeHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Control Center
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Profile 
              profileTitle="홍길동"
              profileDescription="dong@pluxity.com"
              profileItems={[
                { title: '내 정보' },
            ]}
            profileButton={{ 
                title: "로그아웃", 
            }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
 
export default BackofficeHeader
