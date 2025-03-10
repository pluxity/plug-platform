import { Button } from "@plug/ui/src/components/Button";
import { Time } from "@plug/ui/src/components/Time";
import { Badge } from "@plug/ui/src/components/Badge";
import { Checkbox } from "@plug/ui/src/components/Checkbox";
import { RadioGroup, RadioGroupItem } from "@plug/ui/src/components/Radio";
import { Textarea } from "@plug/ui/src/components/Textarea";
import { useState, useCallback, useEffect } from "react";
import MenuIcon from "@plug/ui/src/assets/icons/menu.svg";
import { debounce } from "lodash";
import { Modal } from "@plug/ui/src/components/Modal";
import { Popup } from "@plug/ui/src/components/Popup";
import { Dialog } from "@plug/ui/src/components/Dialog";
import { Card } from "@plug/ui/src/components/Card";

// 서버에서 가져온 데이터를 시뮬레이션하는 인터페이스
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

function App() {
  const [group1, setGroup1] = useState<string>('');
  const [group2, setGroup2] = useState<string>('');
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [textareaInvalid, setTextareaInvalid] = useState<boolean>(false);
  
  // 모달, 팝업, 다이얼로그 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // 서버 데이터 상태
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 서버에서 데이터 가져오기 시뮬레이션
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // 실제로는 API 호출을 하겠지만, 여기서는 시뮬레이션합니다
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 사용자 데이터
      setUsers([
        { id: 1, name: '김철수', email: 'kim@example.com', role: '관리자' },
        { id: 2, name: '이영희', email: 'lee@example.com', role: '사용자' },
        { id: 3, name: '박지민', email: 'park@example.com', role: '사용자' },
      ]);
      
      // 제품 데이터
      setProducts([
        { id: 101, name: '스마트폰', price: 1200000, category: '전자기기' },
        { id: 102, name: '노트북', price: 2500000, category: '전자기기' },
        { id: 103, name: '헤드폰', price: 350000, category: '액세서리' },
      ]);
      
      // 알림 데이터
      setNotifications([
        { id: 201, message: '새로운 업데이트가 있습니다', timestamp: '2023-10-15 09:30:00' },
        { id: 202, message: '시스템 점검 예정', timestamp: '2023-10-16 22:00:00' },
      ]);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, []);
  
  const textareaDebounced = useCallback(
    debounce((value: string) => {
      setTextareaInvalid(value.length <= 10);
      console.log(value);
    }, 500),
    []
  );
  
  const textareaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextareaValue(value);
    textareaDebounced(value);
  };

  return (
    <>
      <div className="h-screen w-screen p-8">
        <h1 className="text-2xl font-bold mb-6">Modal, Popup, Dialog 예제</h1>
        
        <div className="flex gap-4 mb-8">
          <Button variant="default" color="primary" onClick={() => setIsModalOpen(true)}>
            사용자 정보 모달 열기
          </Button>
          
          <Button variant="default" color="secondary" onClick={() => setIsPopupOpen(true)}>
            제품 정보 팝업 열기
          </Button>
          
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            알림 다이얼로그 열기
          </Button>
        </div>
        
        {/* Modal 예제 - 사용자 정보 표시 */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="사용자 정보"
          width={600}
          footer={
            <Button variant="default" color="primary" onClick={() => setIsModalOpen(false)}>
              확인
            </Button>
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">역할</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={user.role === '관리자' ? 'primary' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
        
        {/* Popup 예제 - 제품 정보 표시 */}
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          title="제품 정보"
          placement="center"
          width={350}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{product.name}</h3>
                    <Badge color="primary">{product.category}</Badge>
                  </div>
                  <p className="text-gray-600 mt-1">가격: {product.price.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          )}
        </Popup>
        
        {/* Dialog 예제 - 알림 표시 */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          overlayClassName="bg-black bg-opacity-70"
          contentClassName="max-w-md mx-auto p-4 rounded-xl shadow-xl"
        >
          <div className="p-2">
            <h2 className="text-xl font-semibold mb-4">시스템 알림</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <p>데이터를 불러오는 중...</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {notifications.map(notification => (
                  <div key={notification.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-gray-500 text-sm mt-1">{notification.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <Button variant="default" color="primary" onClick={() => setIsDialogOpen(false)}>
                확인
              </Button>
            </div>
          </div>
        </Dialog>
        
        <hr className="my-8" />
        
        <h2 className="text-xl font-bold mb-4">기존 컴포넌트 예제</h2>
        <Button variant="outline" color="primary">
          <MenuIcon />버튼
        </Button>
        <Time>시간</Time>
        <Badge>뱃지</Badge>
        <Checkbox label="체크박스" variant="primary" type="circle" disabled/>
        <RadioGroup variant="primary" defaultValue="1" name="group1" onChange={(value) => { setGroup1(value); }}>
          <RadioGroupItem value="1" label="option1"/>
          <RadioGroupItem value="2" label="option2" disabled/>
        </RadioGroup>
        <RadioGroup variant="secondary" defaultValue="3" name="group2" onChange={setGroup2}>
          <RadioGroupItem value="3" label="option3"/>
          <RadioGroupItem value="4" label="option4" />
        </RadioGroup>
        <Textarea value={textareaValue} onChange={textareaOnChange} resize="both" placeholder="텍스트를 입력하세요." helperText={textareaInvalid ? "10자 이상 입력해주세요." : ""} invalid={textareaInvalid}
        />
        <label>{group1}</label>
        <label>{group2}</label>
        
        <h2 className="text-xl font-bold mt-8 mb-4">Card 컴포넌트 예제 (합성 패턴)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 카드 예제 */}
          <Card>
            <Card.Header>
              <Card.Title>기본 카드</Card.Title>
              <Card.Description>카드 설명이 여기에 들어갑니다.</Card.Description>
            </Card.Header>
            <Card.Content>
              <p>카드 내용이 여기에 들어갑니다. 다양한 컨텐츠를 포함할 수 있습니다.</p>
            </Card.Content>
            <Card.Footer>
              <Button variant="default" color="primary" className="mr-2">확인</Button>
              <Button variant="outline">취소</Button>
            </Card.Footer>
          </Card>
          
          {/* 닫기 버튼이 있는 카드 */}
          <Card closable onClose={() => alert('카드가 닫혔습니다.')}>
            <Card.Header>
              <Card.Title>닫기 버튼이 있는 카드</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>오른쪽 상단의 X 버튼을 클릭하여 이 카드를 닫을 수 있습니다.</p>
            </Card.Content>
          </Card>
          
          {/* 제품 정보 카드 */}
          <Card className="bg-gray-50">
            <Card.Header>
              <Card.Title>제품 정보</Card.Title>
            </Card.Header>
            <Card.Content>
              {products.length > 0 && (
                <div>
                  <h4 className="font-medium">{products[0].name}</h4>
                  <p className="text-gray-600 mt-1">가격: {products[0].price.toLocaleString()}원</p>
                  <Badge color="primary" className="mt-2">{products[0].category}</Badge>
                </div>
              )}
            </Card.Content>
            <Card.Footer>
              <Button variant="default" color="primary">구매하기</Button>
            </Card.Footer>
          </Card>
          
          {/* 커스텀 스타일 카드 */}
          <Card className="bg-blue-50 border-blue-200">
            <Card.Header className="border-b border-blue-100">
              <Card.Title className="text-blue-800">커스텀 스타일 카드</Card.Title>
            </Card.Header>
            <Card.Content>
              <p>각 컴포넌트에 className을 전달하여 스타일을 커스터마이징할 수 있습니다.</p>
            </Card.Content>
            <Card.Footer className="justify-end">
              <Button variant="outline" color="primary">자세히 보기</Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </>
  )
}

export default App

